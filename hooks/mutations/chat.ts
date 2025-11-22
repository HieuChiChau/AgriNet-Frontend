"use client";

import { useMutation } from "@tanstack/react-query";
import { chatService, CreateMessagePayload } from "@/lib/services/chat.service";
import { useToast } from "@/hooks/use-toast";

export function useCreateMessageMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateMessagePayload) =>
      chatService.createMessage(payload),
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });
}
