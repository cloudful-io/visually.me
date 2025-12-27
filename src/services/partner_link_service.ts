import { supabase } from "@/utils/supabase/client";
import { wrapError, selectMaybeSingle } from "../utils/supabase/helper";
import type { Database } from "../types/database.types";

type PartnerLinkRow = Database["public"]["Tables"]["partner_links"]["Row"];
type PartnerLinkStatus = PartnerLinkRow["status"];

const PARTNER_LINKS_TABLE = "partner_links";

export const PartnerLinkService = {
  /**
   * Invite a partner by email.
   * Calls the `invite_partner` RPC function.
   */
  async invitePartner(
    inviterId: string,
    partnerEmail: string,
    permissions: PartnerLinkRow["permissions"] = { incomes: "view", real_estate: "view" }
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc("invite_partner", {
        inviter_uuid: inviterId,
        partner_email: partnerEmail,
        permissions,
      });

      if (error) throw error;

      // Returns the invite token
      return data as string;
    } catch (error) {
      throw wrapError("Unable to send invitation to a user that has previously been revoked/denied.", error);
    }
  },

  /**
   * Accept a partner invite (for existing user)
   * Calls `accept_partner_invite` RPC
   */
  async acceptInvite(inviteToken: string, partnerId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("accept_partner_invite", {
        invite_token: inviteToken,
        partner_uuid: partnerId,
      });

      if (error) throw error;
    } catch (error) {
      throw wrapError("PartnerLinkService.acceptInvite failed", error);
    }
  },

  /**
   * Complete signup for a non-registered partner
   * Calls `complete_signup_with_invite` RPC
   */
  async completeSignupWithInvite(inviteToken: string, newUserId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("complete_signup_with_invite", {
        invite_token: inviteToken,
        new_user_uuid: newUserId,
      });

      if (error) throw error;
    } catch (error) {
      throw wrapError("PartnerLinkService.completeSignupWithInvite failed", error);
    }
  },

  /**
   * Revokes an existing partnership between 2 accounts
   */
  async revokeLink(linkId: string, currentUserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(PARTNER_LINKS_TABLE)
        .update({ status: "revoked", revoked_at: new Date().toISOString() })
        .eq("id", linkId)
        .or(`user_id.eq.${currentUserId},partner_user_id.eq.${currentUserId}`);

      if (error) throw error;
    } catch (error) {
      throw wrapError("PartnerLinkService.revokeLink failed", error);
    }
  },

  /**
   * Get a partner link by its ID
   */
  async getById(id: string): Promise<PartnerLinkRow | null> {
    try {
      return await selectMaybeSingle<PartnerLinkRow>(
        supabase.from(PARTNER_LINKS_TABLE).select("*").eq("id", id)
      );
    } catch (error) {
      throw wrapError("PartnerLinkService.getById failed", error);
    }
  },

  /**
   * Get all partner links for a user (either as inviter or partner)
   */
  async getForUser(userId: string): Promise<PartnerLinkRow[]> {
    try {
      const { data, error } = await supabase
        .from(PARTNER_LINKS_TABLE)
        .select("*")
        .or(`user_id.eq.${userId},partner_user_id.eq.${userId}`);

      if (error) throw error;
      return data;
    } catch (error) {
      throw wrapError("PartnerLinkService.getForUser failed", error);
    }
  },

  /**
   * Get all partner links for a user (either as inviter or partner)
   */
  async hasPendingLink(userId: string): Promise<boolean> {
    try {
      const links = await this.getForUser(userId);

      return links.some(link => (link.status === "pending") || link.status === "pending_signup");
    } catch (error) {
      throw wrapError("PartnerLinkService.getForUser failed", error);
    }
  },
};
