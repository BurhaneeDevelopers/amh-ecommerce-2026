import { supabase } from "../client";
import { ProductComment, CommentHelpful, CommentReply, CommentStatus } from "../schema/schema.type";

class Comments_Service {

  /**
   * Create a new product comment/feedback
   */
  async createNewComment(payload: Omit<ProductComment, "id" | "created_at" | "updated_at" | "status" | "helpful_count">) {
    try {
      const commentData = {
        ...payload,
        status: "pending" as CommentStatus,
        helpful_count: 0,
      };

      // Try to insert without selecting first to avoid RLS issues
      const { error: insertError } = await supabase
        .from("product_comments")
        .insert(commentData);

      if (insertError) {
        throw insertError;
      }

      // If insert succeeded, return success message
      // We don't try to select the data back since RLS likely prevents
      // users from reading their own pending comments
      return { 
        data: { 
          success: true, 
          message: "Thank you for your feedback! Your review has been submitted and will be published after our team reviews it." 
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error("Error creating comment:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to submit your review. Please try again.";
      
      if (error.message?.includes('duplicate') || error.code === '23505') {
        errorMessage = "You have already submitted a review for this product.";
      } else if (error.message?.includes('foreign key') || error.code === '23503') {
        errorMessage = "Invalid product or user information. Please refresh and try again.";
      } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
        errorMessage = "You don't have permission to submit reviews. Please make sure you're logged in.";
      }
      
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get approved comments for a specific product
   */
  async getApprovedCommentsByProduct(productId: string) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select(`
          *,
          user:users(id, full_name, profile_image),
          replies:comment_replies(
            id,
            reply_text,
            is_public,
            created_at,
            admin:users(id, full_name)
          )
        `)
        .eq("product_id", productId)
        .eq("status", "approved")
        .eq("comment_replies.is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching approved comments:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get featured comments for a product (for homepage/highlights)
   */
  async getFeaturedCommentsByProduct(productId: string, limit: number = 3) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select(`
          *,
          user:users(id, full_name, profile_image)
        `)
        .eq("product_id", productId)
        .eq("status", "approved")
        .eq("is_featured", true)
        .order("rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching featured comments:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get comment statistics for a product
   */
  async getProductCommentStats(productId: string) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select("rating")
        .eq("product_id", productId)
        .eq("status", "approved");

      if (error) throw error;

      const stats = {
        total_reviews: data?.length || 0,
        average_rating: 0,
        rating_distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };

      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, comment) => sum + comment.rating, 0);
        stats.average_rating = Number((totalRating / data.length).toFixed(1));

        // Calculate rating distribution
        data.forEach((comment) => {
          stats.rating_distribution[comment.rating as keyof typeof stats.rating_distribution]++;
        });
      }

      return { data: stats, error: null };
    } catch (error: any) {
      console.error("Error fetching comment stats:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Mark comment as helpful/not helpful
   */
  async markCommentHelpful(commentId: string, userId: string, isHelpful: boolean) {
    try {
      // Check if user already marked this comment
      const { data: existing } = await supabase
        .from("comment_helpful")
        .select("id, is_helpful")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("comment_helpful")
          .update({ is_helpful: isHelpful })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from("comment_helpful")
          .insert({
            comment_id: commentId,
            user_id: userId,
            is_helpful: isHelpful,
          });

        if (error) throw error;
      }

      // Update helpful count in comment
      await this.updateCommentHelpfulCount(commentId);

      return { data: "Success", error: null };
    } catch (error: any) {
      console.error("Error marking comment helpful:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get user's comments
   */
  async getUserComments(userId: string) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select(`
          *,
          product:products(id, product_name, photos)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching user comments:", error);
      return { data: null, error: error.message };
    }
  }

  // ========== Admin/Dashboard Methods ==========

  /**
   * Get all comments for admin dashboard
   */
  async getAllComments() {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select(`
          *,
          user:users(id, full_name, email, profile_image),
          product:products(id, product_name, photos),
          admin:users!approved_by(id, full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching all comments:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get comments by status
   */
  async getCommentsByStatus(status: CommentStatus) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select(`
          *,
          user:users(id, full_name, email, profile_image),
          product:products(id, product_name, photos)
        `)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching comments by status:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get single comment by ID
   */
  async getSingleCommentById(id: string) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select(`
          *,
          user:users(id, full_name, email, profile_image),
          product:products(id, product_name, photos),
          admin:users!approved_by(id, full_name),
          replies:comment_replies(
            id,
            reply_text,
            is_public,
            created_at,
            admin:users(id, full_name)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching comment:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Update comment status (approve/reject)
   */
  async updateCommentStatus(id: string, status: CommentStatus, adminId: string, adminNotes?: string) {
    try {
      const updateData: any = {
        status,
        approved_by: adminId,
        approved_at: new Date().toISOString(),
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from("product_comments")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error updating comment status:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Toggle featured status
   */
  async toggleFeaturedStatus(id: string, isFeatured: boolean) {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .update({ is_featured: isFeatured })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Delete comment
   */
  async deleteCommentById(id: string) {
    try {
      const { error } = await supabase
        .from("product_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { data: "Comment deleted successfully", error: null };
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Add admin reply to comment
   */
  async addCommentReply(commentId: string, adminId: string, replyText: string, isPublic: boolean = true) {
    try {
      const { data, error } = await supabase
        .from("comment_replies")
        .insert({
          comment_id: commentId,
          admin_id: adminId,
          reply_text: replyText,
          is_public: isPublic,
        })
        .select("*")
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error adding comment reply:", error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get comment statistics for dashboard
   */
  async getCommentStatistics() {
    try {
      const { data: allComments, error } = await supabase
        .from("product_comments")
        .select("status, rating, created_at");

      if (error) throw error;

      const stats = {
        total_comments: allComments?.length || 0,
        pending_comments: 0,
        approved_comments: 0,
        rejected_comments: 0,
        average_rating: 0,
        comments_this_month: 0,
      };

      if (allComments && allComments.length > 0) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let totalRating = 0;
        let ratedComments = 0;

        allComments.forEach((comment) => {
          // Status counts
          if (comment.status === "pending") stats.pending_comments++;
          else if (comment.status === "approved") stats.approved_comments++;
          else if (comment.status === "rejected") stats.rejected_comments++;

          // Rating calculation
          if (comment.rating) {
            totalRating += comment.rating;
            ratedComments++;
          }

          // This month count
          const commentDate = new Date(comment.created_at);
          if (commentDate.getMonth() === currentMonth && commentDate.getFullYear() === currentYear) {
            stats.comments_this_month++;
          }
        });

        if (ratedComments > 0) {
          stats.average_rating = Number((totalRating / ratedComments).toFixed(1));
        }
      }

      return { data: stats, error: null };
    } catch (error: any) {
      console.error("Error fetching comment statistics:", error);
      return { data: null, error: error.message };
    }
  }

  // ========== Private Helper Methods ==========

  /**
   * Update helpful count for a comment
   */
  private async updateCommentHelpfulCount(commentId: string) {
    try {
      const { data: helpfulData } = await supabase
        .from("comment_helpful")
        .select("is_helpful")
        .eq("comment_id", commentId);

      const helpfulCount = helpfulData?.filter(item => item.is_helpful).length || 0;

      await supabase
        .from("product_comments")
        .update({ helpful_count: helpfulCount })
        .eq("id", commentId);
    } catch (error) {
      console.error("Error updating helpful count:", error);
    }
  }
}

export const commentsService = new Comments_Service();