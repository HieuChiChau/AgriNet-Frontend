"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/atoms/alert-dialog";
import { useDeletePostMutation } from "@/hooks/mutations/posts";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: string | number;
  onEdit?: () => void;
  className?: string;
}

export function PostActions({ postId, onEdit, className }: PostActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deletePostMutation = useDeletePostMutation();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/farmer/posts/${postId}/edit`);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(postId);
      setShowDeleteDialog(false);
    } catch (error) {
    }
  };

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
        >
          <Icons.edit className="h-4 w-4 mr-1.5" />
          Sửa
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          disabled={deletePostMutation.isPending}
        >
          <Icons.trash className="h-4 w-4 mr-1.5" />
          Xóa
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài đăng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePostMutation.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePostMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

