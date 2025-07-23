import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { appsService } from "@/services/api/appsService";

const AppDetailModal = ({ app, aiLogs, isOpen, onClose }) => {
const [salesComments, setSalesComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    if (isOpen && app) {
      loadSalesComments();
    }
  }, [isOpen, app]);

  const loadSalesComments = async () => {
    try {
      setIsLoadingComments(true);
      const comments = await appsService.getSalesComments(app.Id);
      setSalesComments(comments);
    } catch (error) {
      toast.error("Failed to load sales comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const comment = await appsService.addSalesComment(app.Id, newComment.trim());
      setSalesComments(prev => [comment, ...prev]);
      setNewComment("");
      toast.success("Sales comment added successfully");
    } catch (error) {
      toast.error("Failed to add sales comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      const updatedComment = await appsService.updateSalesComment(commentId, {
        content: editingCommentText.trim()
      });
      setSalesComments(prev => 
        prev.map(c => c.Id === commentId ? updatedComment : c)
      );
      setEditingCommentId(null);
      setEditingCommentText("");
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await appsService.deleteSalesComment(commentId);
      setSalesComments(prev => prev.filter(c => c.Id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.Id);
    setEditingCommentText(comment.content);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{app.name}</h2>
            <p className="text-sm text-slate-500">{app.userEmail}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* App Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500 mb-1">Category</div>
              <div className="font-medium text-slate-900">{app.category}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500 mb-1">Plan</div>
              <div className="font-medium text-slate-900 capitalize">{app.plan}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500 mb-1">Total Messages</div>
              <div className="font-medium text-slate-900">{app.totalMessages}</div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Status</h3>
            <div className="flex items-center space-x-4">
              <StatusBadge status={app.chatAnalysisStatus} />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">Sentiment Score:</span>
                <span className="font-medium text-slate-900">{app.sentimentScore}</span>
              </div>
              <div className="flex items-center space-x-2">
                {app.dbConnected ? (
                  <>
                    <ApperIcon name="Database" className="w-4 h-4 text-success-500" />
                    <span className="text-sm text-success-600">Connected</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="DatabaseX" className="w-4 h-4 text-error-500" />
                    <span className="text-sm text-error-600">Disconnected</span>
                  </>
                )}
              </div>
            </div>
</div>

          {/* Sales Comments */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Comments</h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a sales comment..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isSubmittingComment}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="min-w-[120px]"
                  >
                    {isSubmittingComment ? (
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                        <span>Adding...</span>
                      </div>
                    ) : (
                      "Add Comment"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="flex items-center justify-center py-8">
                <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-500">Loading comments...</span>
              </div>
            ) : salesComments.length > 0 ? (
              <div className="space-y-4">
                {salesComments.map((comment) => (
                  <div key={comment.Id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <ApperIcon name="MessageSquare" className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">Sales Team</div>
                          <div className="text-xs text-slate-500">
                            {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                              <span className="ml-1">(edited)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingComment(comment)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.Id)}
                          className="text-slate-400 hover:text-error-600"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingCommentId === comment.Id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditingComment}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment.Id)}
                            disabled={!editingCommentText.trim()}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="MessageSquare" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No sales comments yet</p>
                <p className="text-sm text-slate-400">Add the first comment above</p>
              </div>
            )}
          </div>

          {/* AI Log Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Analysis Timeline</h3>
            <div className="space-y-4">
              {aiLogs.map((log) => (
                <div key={log.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={log.status} />
                      <span className="text-sm text-slate-500">
                        {format(new Date(log.timestamp), "MMM d, HH:mm:ss")}
                      </span>
                    </div>
                    <div className="flex space-x-4 text-xs text-slate-500">
                      <span>Sentiment: {log.sentiment}</span>
                      <span>Frustration: {log.frustrationLevel}</span>
                      <span>Complexity: {log.technicalComplexity}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Create Support Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppDetailModal;