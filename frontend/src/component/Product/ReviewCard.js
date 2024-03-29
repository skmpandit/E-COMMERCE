import React from 'react'
import Rating from 'react-rating-stars-component'

const ReviewCard = ({review}) => {
    const options = {
        edit: false,
        color: "rgba(20, 20, 20, 0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: review.rating,
        isHalf: true,
      }
  return (
    <div className='reviewCard'>
        <img src="/Profile.png" alt="User" />
        <p>{review.name}</p>
        <Rating {...options}/>
        <span className='reviewCardComment'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard