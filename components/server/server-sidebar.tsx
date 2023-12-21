import { ChannelType, MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";
import { Crown, Hash, Mic, ShieldCheck, Video } from "lucide-react";

interface ServerSiderbarProps {
	serverId: string;
}

const channelIconMap = {
	[ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
	[ChannelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
	[ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
	[MemberRole.ADMIN]: <Crown className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSiderbar = async ({ serverId }: ServerSiderbarProps) => {
	const profile = await currentProfile();

	if (!profile) return redirect("/");

	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	});

	const textChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.TEXT
	);
	const audioChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.AUDIO
	);
	const videoChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.VIDEO
	);
	const members = server?.members.filter(
		(member) => member.profileId !== profile.id
	);

	if (!server) return redirect("/");

	const role = server.members.find(
		(member) => member.profileId === profile.id
	)?.role;

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: "text channels",
								type: "channel",
								data: textChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: channelIconMap[channel.type],
								})),
							},
							{
								label: "voice channels",
								type: "channel",
								data: audioChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: channelIconMap[channel.type],
								})),
							},
							{
								label: "video channels",
								type: "channel",
								data: videoChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: channelIconMap[channel.type],
								})),
							},
							{
								label: "members",
								type: "member",
								data: members?.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role],
								})),
							},
						]}
					/>
				</div>
			</ScrollArea>
		</div>
	);
};
