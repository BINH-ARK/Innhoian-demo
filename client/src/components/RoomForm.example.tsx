/**
 * Example: Room Form Component for Admin Dashboard
 * 
 * This component demonstrates how to integrate the POST /api/admin/rooms/save API
 * into a React form for creating and updating rooms.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/routes';

// Form validation schema
const roomFormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Room name is required'),
    type: z.string().min(1, 'Room type is required'),
    price: z.number().min(0, 'Price must be positive'),
    status: z.string().optional(),
    projectId: z.number().optional(),
    description: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
});

type RoomFormData = z.infer<typeof roomFormSchema>;

interface RoomFormProps {
    room?: RoomFormData; // If provided, form is in edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    // Setup form with react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RoomFormData>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: room || {
            name: '',
            type: 'double',
            price: 0,
            status: 'available',
            description: '',
        },
    });

    // Mutation for saving room
    const saveRoomMutation = useMutation({
        mutationFn: async (data: RoomFormData) => {
            const response = await fetch(api.rooms.save.path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save room');
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate rooms query to refetch data
            queryClient.invalidateQueries({ queryKey: [api.rooms.list.path] });

            // Reset form
            reset();

            // Call success callback
            onSuccess?.();
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });

    // Form submit handler
    const onSubmit = (data: RoomFormData) => {
        setError(null);
        saveRoomMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error message */}
            {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Room Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Room Name *
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Deluxe Garden View"
                />
                {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Room Type */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                    Room Type *
                </label>
                <select
                    {...register('type')}
                    id="type"
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="twin">Twin</option>
                    <option value="suite">Suite</option>
                </select>
                {errors.type && (
                    <p className="text-destructive text-sm mt-1">{errors.type.message}</p>
                )}
            </div>

            {/* Price */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Price per Night (VND) *
                </label>
                <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    id="price"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., 800000"
                />
                {errors.price && (
                    <p className="text-destructive text-sm mt-1">{errors.price.message}</p>
                )}
            </div>

            {/* Status */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Status
                </label>
                <select
                    {...register('status')}
                    id="status"
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Describe the room..."
                />
            </div>

            {/* Project ID */}
            <div>
                <label htmlFor="projectId" className="block text-sm font-medium mb-2">
                    Project ID
                </label>
                <input
                    {...register('projectId', { valueAsNumber: true })}
                    type="number"
                    id="projectId"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., 1"
                />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={saveRoomMutation.isPending}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    {saveRoomMutation.isPending
                        ? 'Saving...'
                        : room?.id
                            ? 'Update Room'
                            : 'Create Room'}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-lg hover:bg-secondary"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

/**
 * Example usage in Admin.tsx:
 * 
 * import { RoomForm } from './RoomForm';
 * 
 * // In your component:
 * const [showForm, setShowForm] = useState(false);
 * const [editingRoom, setEditingRoom] = useState(null);
 * 
 * // Add Room button
 * <Button onClick={() => setShowForm(true)}>
 *   <Plus size={18} />
 *   Add Room
 * </Button>
 * 
 * // Modal/Dialog with form
 * {showForm && (
 *   <Dialog open={showForm} onOpenChange={setShowForm}>
 *     <DialogContent>
 *       <DialogHeader>
 *         <DialogTitle>
 *           {editingRoom ? 'Edit Room' : 'Add New Room'}
 *         </DialogTitle>
 *       </DialogHeader>
 *       <RoomForm
 *         room={editingRoom}
 *         onSuccess={() => {
 *           setShowForm(false);
 *           setEditingRoom(null);
 *         }}
 *         onCancel={() => {
 *           setShowForm(false);
 *           setEditingRoom(null);
 *         }}
 *       />
 *     </DialogContent>
 *   </Dialog>
 * )}
 */

/**
 * Simple example without form library:
 */
export function SimpleRoomForm() {
    const [formData, setFormData] = useState({
        name: '',
        type: 'double',
        price: 0,
        status: 'available',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/rooms/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const savedRoom = await response.json();
            console.log('Room saved:', savedRoom);

            // Reset form
            setFormData({
                name: '',
                type: 'double',
                price: 0,
                status: 'available',
                description: '',
            });

            alert('Room saved successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}

            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Room Name"
                required
            />

            <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="twin">Twin</option>
                <option value="suite">Suite</option>
            </select>

            <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="Price"
                required
            />

            <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Room'}
            </button>
        </form>
    );
}
