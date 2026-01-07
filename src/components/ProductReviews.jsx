import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LuStar, LuUser, LuMessageSquare, LuSend } from 'react-icons/lu';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * Component ProductReviews - Hiển thị và quản lý đánh giá sản phẩm
 * Chức năng:
 * - Người dùng bình thường: Xem đánh giá
 * - Người đã mua: Viết đánh giá
 * - Admin/nhân viên: Phản hồi đánh giá
 */
export default function ProductReviews({ productId }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // State cho form đánh giá
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // State cho form phản hồi
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Tải danh sách đánh giá
  useEffect(() => {
    if (productId) {
      fetchReviews();
      if (isAuthenticated) {
        checkPurchaseStatus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/product/${productId}`);
      setReviews(response.data || []);
      
      // Kiểm tra xem user đã review chưa
      if (user && response.data) {
        const userReview = response.data.find(r => r.user?._id === user._id || r.user?.id === user.id);
        setHasReviewed(!!userReview);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      // Kiểm tra xem user đã mua sản phẩm này chưa
      const response = await api.get(`/orders/check-purchase/${productId}`);
      setHasPurchased(response.data.hasPurchased || false);
    } catch (error) {
      console.error('Error checking purchase status:', error);
      setHasPurchased(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!rating || !comment.trim()) {
      toast.error('Vui lòng chọn số sao và nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/reviews', {
        product: productId,
        rating,
        comment: comment.trim(),
      });
      
      toast.success('Đã gửi đánh giá thành công!');
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      setHasReviewed(true);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    try {
      await api.post(`/reviews/${reviewId}/reply`, {
        reply: replyText.trim(),
      });
      
      toast.success('Đã gửi phản hồi thành công!');
      setReplyText('');
      setReplyingTo(null);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Không thể gửi phản hồi');
    }
  };

  const canReply = user && (user.role === 'admin' || user.role === 'employee');
  const canReview = isAuthenticated && hasPurchased && !hasReviewed;

  // Tính trung bình rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Render stars
  const renderStars = (rating, size = 20, interactive = false, onStarClick = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onStarClick && onStarClick(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <LuStar
              size={size}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Đánh giá sản phẩm</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-lg font-bold text-white">{averageRating}</span>
            </div>
            <span className="text-neutral-400 text-sm">({reviews.length} đánh giá)</span>
          </div>
        </div>

        {/* Nút viết đánh giá */}
        {canReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <LuMessageSquare size={18} />
            Viết đánh giá
          </button>
        )}
      </div>

      {/* FORM VIẾT ĐÁNH GIÁ */}
      {showReviewForm && canReview && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Chọn số sao
            </label>
            {renderStars(rating, 28, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Nội dung đánh giá
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <LuSend size={16} />
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setComment('');
                setRating(5);
              }}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* THÔNG BÁO CHO USER CHƯA MUA */}
      {isAuthenticated && !hasPurchased && !hasReviewed && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-500 text-sm">
            Bạn cần mua sản phẩm này để có thể đánh giá
          </p>
        </div>
      )}

      {/* DANH SÁCH ĐÁNH GIÁ */}
      {loading ? (
        <div className="text-center py-8 text-neutral-400">Đang tải đánh giá...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-neutral-400">
          Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id || review.id} className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-800">
              {/* Thông tin user và rating */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <LuUser size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {review.user?.name || review.user?.username || 'Người dùng'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating, 16)}
                      <span className="text-xs text-neutral-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nội dung đánh giá */}
              <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                {review.comment}
              </p>

              {/* Phản hồi từ shop */}
              {review.reply && (
                <div className="mt-3 pl-4 border-l-2 border-indigo-500 bg-indigo-500/5 p-3 rounded-r-lg">
                  <p className="text-xs font-semibold text-indigo-400 mb-1">
                    Phản hồi từ Shop
                  </p>
                  <p className="text-neutral-300 text-sm">{review.reply}</p>
                </div>
              )}

              {/* Form phản hồi cho admin/employee */}
              {canReply && !review.reply && (
                <div className="mt-3">
                  {replyingTo === review._id || replyingTo === review.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập phản hồi..."
                        className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleSubmitReply(review._id || review.id)}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <LuSend size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(review._id || review.id)}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                    >
                      <LuMessageSquare size={14} />
                      Phản hồi
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
