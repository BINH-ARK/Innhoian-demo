import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSavePost } from '@/hooks/use-posts-crud';
import type { Post } from '@shared/schema';

interface PostFormModalProps {
    open: boolean;
    onClose: () => void;
    post: Post | null; // null = Add mode, Post = Edit mode
}

export function PostFormModal({
    open,
    onClose,
    post,
}: PostFormModalProps) {
    const savePost = useSavePost();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        category: '',
        imageUrl: '',
        author: '',
    });

    /**
     * Auto-fill form when editing
     */
    useEffect(() => {
        if (post) {
            console.log('[PostFormModal] Loading data for edit:', post);
            setFormData({
                title: post.title || '',
                slug: post.slug || '',
                content: post.content || '',
                category: post.category || '',
                imageUrl: post.imageUrl || '',
                author: post.author || '',
            });
        } else {
            console.log('[PostFormModal] Resetting form for add mode');
            resetForm();
        }
    }, [post, open]);

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            content: '',
            category: '',
            imageUrl: '',
            author: '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...(post?.id && { id: post.id }), // If has ID = UPDATE
            ...formData,
        };

        console.log('[PostFormModal] Submitting data:', data);

        savePost.mutate(data, {
            onSuccess: () => {
                console.log('[PostFormModal] Save successful');
                resetForm();
                onClose();
            },
            onError: (error: Error) => {
                console.error('[PostFormModal] Save failed:', error);
                alert(`Failed to save post: ${error.message}`);
            },
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {post ? 'Edit Post' : 'Add New Post'}
                    </DialogTitle>
                    <DialogDescription>
                        {post
                            ? 'Update post information below'
                            : 'Fill in the details to create a new blog post'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Post Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Awakening the Soul of a Home"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Slug <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="e.g., awakening-soul"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            URL-friendly version of the title
                        </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Operating Stories, People & Stories"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            Content <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your post content..."
                            rows={8}
                            required
                        />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            placeholder="e.g., INN Team"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={savePost.isPending}>
                            {savePost.isPending
                                ? 'Saving...'
                                : post
                                    ? 'Update Post'
                                    : 'Create Post'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
