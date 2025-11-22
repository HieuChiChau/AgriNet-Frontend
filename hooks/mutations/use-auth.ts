"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services";
import { LoginFormData, RegisterFormData } from "@/lib/validations";

const registerPayload = (data: RegisterFormData) => {
  const { confirmPassword, ...rest } = data;
  return rest;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginFormData) => authService.login(payload),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterFormData) =>
      authService.register(registerPayload(payload)),
  });
}
