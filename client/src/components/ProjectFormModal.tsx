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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useSaveProject } from '@/hooks/use-projects-crud';
import type { Project } from '@shared/schema';

interface ProjectFormModalProps {
    open: boolean;
    onClose: () => void;
    project: Project | null; // null = Add mode, Project = Edit mode
}

export function ProjectFormModal({
    open,
    onClose,
    project,
}: ProjectFormModalProps) {
    const saveProject = useSaveProject();

    // Form state (no location field - not in schema)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        type: '',
        slogan: '',
        airbnbUrl: '',
        isFeatured: false,
    });

    // Tags state (array)
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    // Images state (array)
    const [images, setImages] = useState<string[]>([]);
    const [imageInput, setImageInput] = useState('');

    /**
     * Auto-fill form when editing
     * Đổ dữ liệu cũ vào form khi project thay đổi
     */
    useEffect(() => {
        if (project) {
            console.log('[ProjectFormModal] Loading data for edit:', project);

            setFormData({
                name: project.name || '',
                slug: project.slug || '',
                description: project.description || '',
                type: project.type || '',
                slogan: project.slogan || '',
                airbnbUrl: project.airbnbUrl || '',
                isFeatured: project.isFeatured || false,
            });

            // Parse tags and images (they might be JSON strings or arrays)
            let parsedTags: string[] = [];
            if (Array.isArray(project.tags)) {
                parsedTags = project.tags;
            } else if (project.tags && typeof project.tags === 'string') {
                try {
                    parsedTags = JSON.parse(project.tags);
                } catch (e) {
                    parsedTags = [];
                }
            }

            let parsedImages: string[] = [];
            if (Array.isArray(project.images)) {
                parsedImages = project.images;
            } else if (project.images && typeof project.images === 'string') {
                try {
                    parsedImages = JSON.parse(project.images);
                } catch (e) {
                    parsedImages = [];
                }
            }

            setTags(parsedTags);
            setImages(parsedImages);
        } else {
            // Reset form for Add mode
            console.log('[ProjectFormModal] Resetting form for add mode');
            resetForm();
        }
    }, [project, open]);

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            type: '',
            slogan: '',
            airbnbUrl: '',
            isFeatured: false,
        });
        setTags([]);
        setImages([]);
        setTagInput('');
        setImageInput('');
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleAddImage = () => {
        if (imageInput.trim() && !images.includes(imageInput.trim())) {
            setImages([...images, imageInput.trim()]);
            setImageInput('');
        }
    };

    const handleRemoveImage = (imageToRemove: string) => {
        setImages(images.filter(img => img !== imageToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...(project?.id && { id: project.id }), // Nếu có ID = UPDATE
            ...formData,
            tags,
            images,
        };

        console.log('[ProjectFormModal] Submitting data:', data);

        saveProject.mutate(data, {
            onSuccess: () => {
                console.log('[ProjectFormModal] Save successful');
                resetForm();
                onClose();
            },
            onError: (error) => {
                console.error('[ProjectFormModal] Save failed:', error);
                alert(`Failed to save project: ${error.message}`);
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
                        {project ? 'Edit Project' : 'Add New Project'}
                    </DialogTitle>
                    <DialogDescription>
                        {project
                            ? 'Update project information below'
                            : 'Fill in the details to create a new project'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Project Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Camf Homestay"
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
                            placeholder="e.g., camf-homestay"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            URL-friendly version of the name (e.g., "camf-homestay")
                        </p>
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            placeholder="e.g., Homestay, Villa"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the project..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* Slogan */}
                    <div className="space-y-2">
                        <Label htmlFor="slogan">Slogan</Label>
                        <Input
                            id="slogan"
                            value={formData.slogan}
                            onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                            placeholder="e.g., Your home away from home"
                        />
                    </div>

                    {/* Airbnb URL */}
                    <div className="space-y-2">
                        <Label htmlFor="airbnbUrl">Airbnb URL</Label>
                        <Input
                            id="airbnbUrl"
                            type="url"
                            value={formData.airbnbUrl}
                            onChange={(e) => setFormData({ ...formData, airbnbUrl: e.target.value })}
                            placeholder="https://airbnb.com/..."
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Add a tag..."
                            />
                            <Button type="button" onClick={handleAddTag} variant="outline">
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                    {tag}
                                    <X
                                        size={14}
                                        className="cursor-pointer"
                                        onClick={() => handleRemoveTag(tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <Label>Images (URLs)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                                placeholder="Paste image URL..."
                            />
                            <Button type="button" onClick={handleAddImage} variant="outline">
                                Add
                            </Button>
                        </div>
                        <div className="space-y-2 mt-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                                    <span className="flex-1 text-sm truncate">{img}</span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleRemoveImage(img)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="isFeatured" className="cursor-pointer">
                            Featured Project
                        </Label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saveProject.isPending}>
                            {saveProject.isPending
                                ? 'Saving...'
                                : project
                                    ? 'Update Project'
                                    : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
