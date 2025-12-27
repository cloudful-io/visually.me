'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "../components/container/PageContainer";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { PartnerLinkService } from "@/services/partner_link_service";
import { supabase } from '@/utils/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { UserProfileService } from "supabase-auth-lib";
import { IncomingInviteCard } from "../components/dashboard/IncomingInviteCard";
import { OutgoingInviteCard } from "../components/dashboard/OutgoingInviteCard";
import { LinkedPartnerCard } from "../components/dashboard/LinkedPartnerCard";
import { InvitePartnerCard } from "../components/dashboard/InvitePartnerCard";

type Permissions = {
  incomes: boolean;
  real_estate: boolean;
};

export default function LinkedPartnerAccountPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();

  const [partnerEmail, setPartnerEmail] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    incomes: true,
    real_estate: true,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [existingLinks, setExistingLinks] = useState<any[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  type PartnerProfile = {
    display_name: string;
    avatar_url: string | null;
  };

const [partnerProfiles, setPartnerProfiles] = useState<Record<string, PartnerProfile>>({});

  useEffect(() => {
    if (!user) return;
    fetchLinks();
  }, [user]);

  const fetchLinks = async () => {
    setLoadingLinks(true);
    try {
      const links = await PartnerLinkService.getForUser(user!.id);
      setExistingLinks(links || []);

      // Determine all counterpart user IDs
      const counterpartIds = (links || [])
        .filter((l: any) =>
          ["pending", "linked"].includes(l.status)
        )
        .map((l: any) =>
          l.user_id === user!.id ? l.partner_user_id : l.user_id
        )
        .filter(Boolean);

      // Deduplicate + exclude already fetched
      const missingIds = [...new Set(counterpartIds)].filter(
        (id) => !partnerProfiles[id]
      );

      if (missingIds.length > 0) {
        const userProfileService = new UserProfileService(supabase);

        const profiles = await Promise.all(
          missingIds.map(async (id) => {
            const profile = await userProfileService.getById(id);
            return { id, profile };
          })
        );

        setPartnerProfiles((prev) => ({
          ...prev,
          ...Object.fromEntries(
            profiles.map((p) => [
              p.id,
              {
                display_name: p.profile!.display_name,
                avatar_url: p.profile!.avatar_url,
              },
            ])
          ),
        }));
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to load partner links");
    } finally {
      setLoadingLinks(false);
    }
  };


  const handlePermissionChange = (key: keyof Permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const permissionPayload = Object.fromEntries(
        Object.entries(permissions).map(([k, v]) => [k, v ? "view" : "none"])
      );

      const inviteToken = await PartnerLinkService.invitePartner(user!.id, partnerEmail, permissionPayload);
      setSuccessMsg(`Invitation sent successfully!`);
      setPartnerEmail("");
      setPermissions({ incomes: true, real_estate: true });
      await fetchLinks();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (linkId: string) => {
    setLoading(true);
    try {
      await PartnerLinkService.revokeLink(linkId, user!.id);
      setSuccessMsg("Link revoked successfully");
      await fetchLinks();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to revoke link");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (linkId: string) => {
    setLoading(true);
    try {
      await PartnerLinkService.acceptInvite(linkId, user!.id);
      setSuccessMsg("Partner link accepted");
      await fetchLinks();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to accept link");
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async (linkId: string) => {
    setLoading(true);
    try {
      await PartnerLinkService.revokeLink(linkId, user!.id);
      setSuccessMsg("Partner link denied");
      await fetchLinks();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to deny link");
    } finally {
      setLoading(false);
    }
  };

  const activeLinks = existingLinks.filter(
  (link) => link.status !== "revoked" && link.status !== "declined"
);

  if (!user) {
    return <Typography>Please log in to link a partner.</Typography>;
  }

  return (
    <PageContainer 
      title="Linked Partner Account" 
      description="A linked partner account allows you to share retirement income, investment accounts, and real estate properties."
      showTitle
    >
      <Typography variant="subtitle1">
        A linked partner account allows you to share retirement income, investment accounts, and real estate properties.
      </Typography>
      {loadingLinks ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {successMsg && <Alert severity="success" sx={{ my: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ my: 2 }}>{errorMsg}</Alert>}
          
          {/* Check existing links */}
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => {
              if (link.status === "linked") {
                const partnerId =
                  link.user_id === user.id ? link.partner_user_id : link.user_id;

                const partner = partnerProfiles[partnerId];
                return (
                  <LinkedPartnerCard
                    key={link.id}
                    partner={partner}
                    onRevoke={() => handleRevoke(link.id)}
                  />
                );
              } else if ((link.status === "pending" || link.status === "pending_signup") && link.user_id === user.id) {
                return (
                  <OutgoingInviteCard
                    key={link.id}
                    partnerEmail={link.partner_email}
                    onRevoke={() => handleRevoke(link.id)}
                  />
                );
              } else if (link.status === "pending" && link.partner_user_id === user.id) {
                const inviter = partnerProfiles[link.user_id];

                return (
                  <IncomingInviteCard
                    key={link.id}
                    inviter={inviter}
                    onAccept={() => handleAccept(link.id)}
                    onDeny={() => handleDeny(link.id)}
                  />
                );
              }
            })
          ) : (
            // No existing links → show invite form
            <InvitePartnerCard
              loading={loading}
              onSubmit={async (email, permissions) => {
                setLoading(true);
                setErrorMsg("");
                setSuccessMsg("");

                try {
                  const permissionPayload = Object.fromEntries(
                    Object.entries(permissions).map(([k, v]) => [
                      k,
                      v ? "view" : "none",
                    ])
                  );

                  await PartnerLinkService.invitePartner(
                    user!.id,
                    email,
                    permissionPayload
                  );

                  setSuccessMsg("Invitation sent successfully!");
                  await fetchLinks();
                } catch (error: any) {
                  setErrorMsg(error.message || "Failed to send invite");
                } finally {
                  setLoading(false);
                }
              }}
            />

          )}
        </>
      )}
    </PageContainer>
  );
}
