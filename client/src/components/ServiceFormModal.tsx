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
import { useSaveService } from '@/hooks/use-services-crud';
import type { Service } from '@shared/schema';

interface ServiceFormModalProps {
    open: boolean;
    onClose: () => void;
    service: Service | null; // null = Add mode, Service = Edit mode
}

export function ServiceFormModal({
    open,
    onClose,
    service,
}: ServiceFormModalProps) {
    const saveService = useSaveService();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '',
    });

    /**
     * Auto-fill form when editing
     */
    useEffect(() => {
        if (service) {
            console.log('[ServiceFormModal] Loading data for edit:', service);
            setFormData({
                title: service.title || '',
                description: service.description || '',
                icon: service.icon || '',
            });
        } else {
            console.log('[ServiceFormModal] Resetting form for add mode');
            resetForm();
        }
    }, [service, open]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            icon: '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...(service?.id && { id: service.id }), // If has ID = UPDATE
            ...formData,
        };

        console.log('[ServiceFormModal] Submitting data:', data);

        saveService.mutate(data, {
            onSuccess: () => {
                console.log('[ServiceFormModal] Save successful');
                resetForm();
                onClose();
            },
            onError: (error) => {
                console.error('[ServiceFormModal] Save failed:', error);
                alert(`Failed to save service: ${error.message}`);
            },
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {service ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                    <DialogDescription>
                        {service
                            ? 'Update service information below'
                            : 'Fill in the details to create a new service'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Service Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Management & Operations"
                            required
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
                            placeholder="Describe the service..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* Icon */}
                    <div className="space-y-2">
                        <Label htmlFor="icon">Icon Name</Label>
                        <Input
                            id="icon"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="e.g., settings, briefcase, hammer"
                        />
                        <p className="text-xs text-muted-foreground">
                            Icon name from Lucide React (optional)
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saveService.isPending}>
                            {saveService.isPending
                                ? 'Saving...'
                                : service
                                    ? 'Update Service'
                                    : 'Create Service'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
