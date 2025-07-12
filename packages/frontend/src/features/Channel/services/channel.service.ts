import api from '@/services/api';
import type { Channel, ChannelType } from '@/types';

export const fetchChannels = async (serverId: string): Promise<Channel[]> => {
  const res = await api.get<Channel[]>(`/servers/${serverId}/channels`);
  return res.data;
};

export const createChannel = async (
  serverId: string,
  name: string,
  description: string,
  type: ChannelType
): Promise<Channel> => {
  const res = await api.post<Channel>(`/servers/${serverId}/channels`, {
    name,
    description,
    type,
  });
  return res.data;
};
