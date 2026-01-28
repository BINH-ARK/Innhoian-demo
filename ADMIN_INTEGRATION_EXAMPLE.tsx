/**
 * Admin.tsx - Complete Integration Example
 * Copy các phần này vào file Admin.tsx của bạn
 */

import { useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { ViewDetailModal } from '@/components/ViewDetailModal';
import { useProjectDetail, usePostDetail, useRoomDetail } from '@/hooks/use-detail';
import type { Project, Post, Room } from '@shared/schema';

export default function Admin() {
    // ==================== STATE MANAGEMENT ====================

    // View Modal State
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [selectedItemType, setSelectedItemType] = useState<'project' | 'post' | 'room' | null>(null);

    // Fetch detail data based on selected item
    const { data: projectDetail, isLoading: loadingProject } = useProjectDetail(
        selectedItemType === 'project' ? selectedItemId : null
    );
    const { data: postDetail, isLoading: loadingPost } = usePostDetail(
        selectedItemType === 'post' ? selectedItemId : null
    );
    const { data: roomDetail, isLoading: loadingRoom } = useRoomDetail(
        selectedItemType === 'room' ? selectedItemId : null
    );

    // Get current detail data
    const currentDetail = selectedItemType === 'project' ? projectDetail
        : selectedItemType === 'post' ? postDetail
            : selectedItemType === 'room' ? roomDetail
                : null;

    const isLoadingDetail = loadingProject || loadingPost || loadingRoom;

    // ==================== HANDLER FUNCTIONS ====================

    /**
     * Handler để mở View modal cho Project
     * Lưu ID và type vào state, sau đó mở modal
     */
    const handleViewProject = (project: Project) => {
        console.log('[View Project] Opening modal for:', project.name);
        setSelectedItemType('project');
        setSelectedItemId(project.id);
        setShowViewModal(true);
    };

    /**
     * Handler để mở View modal cho Post
     */
    const handleViewPost = (post: Post) => {
        console.log('[View Post] Opening modal for:', post.title);
        setSelectedItemType('post');
        setSelectedItemId(post.id);
        setShowViewModal(true);
    };

    /**
     * Handler để mở View modal cho Room
     */
    const handleViewRoom = (room: Room) => {
        console.log('[View Room] Opening modal for:', room.name);
        setSelectedItemType('room');
        setSelectedItemId(room.id);
        setShowViewModal(true);
    };

    /**
     * Handler để đóng View modal
     * Reset tất cả state về null
     */
    const handleCloseViewModal = () => {
        console.log('[View Modal] Closing');
        setShowViewModal(false);
        setSelectedItemType(null);
        setSelectedItemId(null);
    };

    // ==================== JSX EXAMPLE ====================

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* ... existing navbar ... */}

            <div className="container mx-auto px-4 py-8">
                {/* Projects List Example */}
                <div className="space-y-4">
                    {projects?.map((project) => (
                        <div key={project.id} className="flex items-center justify-between border p-4 rounded-lg">
                            <div>
                                <h3 className="font-semibold">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">{project.location}</p>
                            </div>

                            <div className="flex gap-2">
                                {/* View Button - WORKING! */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewProject(project)}
                                >
                                    <Eye size={16} className="mr-1" />
                                    View
                                </Button>

                                {/* Edit Button */}
                                <Button variant="ghost" size="sm">
                                    <Edit size={16} className="mr-1" />
                                    Edit
                                </Button>

                                {/* Delete Button */}
                                <Button variant="ghost" size="sm">
                                    <Trash2 size={16} className="mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Detail Modal - Thêm vào cuối file, trước </div> đóng */}
            <ViewDetailModal
                open={showViewModal}
                onClose={handleCloseViewModal}
                data={currentDetail}
                type={selectedItemType || 'project'}
            />

            {/* Loading Overlay (Optional) */}
            {isLoadingDetail && showViewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                        <p className="mt-4 text-sm text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== DEBUGGING TIPS ====================

/**
 * Nếu View button vẫn không hoạt động:
 * 
 * 1. Kiểm tra Console:
 *    - Mở DevTools (F12)
 *    - Tab Console
 *    - Click View button
 *    - Xem có log "[View Project] Opening modal for: ..." không
 * 
 * 2. Kiểm tra Import:
 *    - Đảm bảo đã import ViewDetailModal
 *    - Đảm bảo đã import hooks (useProjectDetail, etc.)
 * 
 * 3. Kiểm tra State:
 *    - Thêm console.log(showViewModal, selectedItemId) trong component
 *    - Xem state có thay đổi không khi click
 * 
 * 4. Kiểm tra Modal Component:
 *    - Xem ViewDetailModal có render không
 *    - Kiểm tra prop 'open' có được truyền đúng không
 */
