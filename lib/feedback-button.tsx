'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setSubmitting(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('feedback').insert({
      user_id: user.id,
      rating,
      comment,
      page: window.location.pathname,
    })

    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setRating(0)
      setComment('')
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-green-700"
      >
        📣 Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Share Your Feedback</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            </div>

            {submitted ? (
              <p className="text-sm text-green-600 text-center py-4">
                ✓ Thank you for your feedback!
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">How would you rate your experience?</p>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= rating ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What's working? What could be better? What do you wish it could do?"
                  rows={3}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting || rating === 0}
                  className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                {rating === 0 && (
                  <p className="text-xs text-gray-400 text-center mt-2">Please select a star rating</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}