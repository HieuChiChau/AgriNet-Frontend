"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/atoms/card";

interface AuthPageTemplateProps {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthPageTemplate({
  title,
  description,
  badge,
  children,
  footer,
}: AuthPageTemplateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50 p-4">
      <Card className="w-full max-w-md border-green-200 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow">
              Ag
            </div>
          </div>
          {badge && (
            <span className="mx-auto inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-700">
              {badge}
            </span>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm text-gray-500">{description}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && <CardFooter className="flex flex-col space-y-2">{footer}</CardFooter>}
      </Card>
    </div>
  );
}

