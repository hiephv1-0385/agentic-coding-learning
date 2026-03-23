"use client";

import Icon from "@/components/ui/Icon";
import UserInfo from "@/components/kudos/UserInfo";
import AwardBadge from "@/components/kudos/AwardBadge";
import ProfilePreviewTooltip from "@/components/kudos/ProfilePreviewTooltip";
import type { Profile } from "@/types/kudos";

interface KudosCardHeaderProps {
  sender: Profile;
  receiver: Profile;
  isAnonymous?: boolean;
  anonymousName?: string | null;
}

export default function KudosCardHeader({
  sender,
  receiver,
  isAnonymous = false,
  anonymousName,
}: KudosCardHeaderProps) {
  const senderDisplayName = isAnonymous
    ? anonymousName || "Ẩn danh"
    : sender.display_name;

  return (
    <div className="flex flex-row items-center justify-between gap-4 lg:gap-6">
      <div className="flex flex-col items-center gap-1">
        {isAnonymous ? (
          <UserInfo
            avatarUrl={null}
            name={senderDisplayName}
            department={null}
          />
        ) : (
          <ProfilePreviewTooltip userId={sender.id}>
            <UserInfo
              avatarUrl={sender.avatar_url}
              name={sender.display_name}
              department={sender.department}
            />
          </ProfilePreviewTooltip>
        )}
        {!isAnonymous && (
          <AwardBadge kudosReceivedCount={sender.kudos_received_count} />
        )}
      </div>
      <div className="shrink-0">
        <Icon name="arrow-sent" size={32} className="text-text-dark" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <ProfilePreviewTooltip userId={receiver.id}>
          <UserInfo
            avatarUrl={receiver.avatar_url}
            name={receiver.display_name}
            department={receiver.department}
          />
        </ProfilePreviewTooltip>
        <AwardBadge kudosReceivedCount={receiver.kudos_received_count} />
      </div>
    </div>
  );
}
