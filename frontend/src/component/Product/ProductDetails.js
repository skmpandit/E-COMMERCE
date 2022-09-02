import React, { Fragment, useState } from 'react'
import Carousel from "react-material-ui-carousel"
import { clearErrors, getProductDetails } from '../../actions/productAction'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import './ProductDetails.css'
import ReactStars from 'react-rating-stars-component'
import  ReviewCard  from './ReviewCard.js'
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'


const ProductDetails = ({match}) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity, setQuantity] = useState(1);

  const { product, loading, error } = useSelector((state) => state.productDetails)
  
  const options = {
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  }

  const submitReviewToggle = () => {

  }

  const increaseQuantity = () => {

  }

  const decreaseQuantity = () => {

  }

  const addToCartHandler = () => {

  }

  useEffect(() => {
    if(error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(match.params.id))
  }, [dispatch, match.params.id, error, alert]);
  return (
    <Fragment>
      {
        loading ?( <Loader /> ): (
          <Fragment>
            <MetaData title={`${product.name} -- ECOMMERCE`}/>
            <div className='ProductDetails'>
                <div>
                  <div className="ProductDetailsCarousel">
                    <Carousel > 
                      {product.image && product.image.map((item, i) => (
                        <img className='CarouselImage' src={item.url} key={item.url} alt={`${i} Slide`} />
                      ))}
                    </Carousel>
                  </div>
                </div>
                <div>
                  <div className='detailsBlock-1'>
                      <h2>{product.name}</h2>
                      <p>Product # {product._id}</p>
                  </div>
                  <div className="detailsBlock-2">
                    <ReactStars {...options}/>
                    <span>({product.numOfReviews} Reviews)</span>
                  </div>
                  <div className="detailsBlock-3">
                    <h1>{`₹ ${product.price}`}</h1>
                    <div className="detailsBlock-3-1">
                      <div className="detailsBlock-3-1-1">
                        <button onClick={decreaseQuantity}>-</button>
                        <input className='detailInputBlock' type="number" readOnly value={quantity} />
                        <button onClick={increaseQuantity} >+</button>
                      </div>
                      <button disabled={product.Stock < 1 ? true : false } onClick={addToCartHandler} >Add to Cart</button>
                    </div>
                    <p>
                      Status: {" "}
                      <b className={product.Stock < 1 ? "redColor" : "greenColor" } >
                        {product.Stock < 1 ? "Out of Stock" : "In Stock"}
                      </b>
                    </p>
                  </div>
                  <div className="detailsBlock-4">
                    Description : <p>{product.description}</p>
                  </div>
                  <button onClick={submitReviewToggle} className="submitReview" >
                      Submit Review
                  </button>
                </div>
            </div>
            <h3 className='reviewsHeading' >REVIEWS</h3>
            {product.reviews && product.reviews[0] ? (
                <div className="reviews">
                  {product.reviews.map((review) => (
                    <ReviewCard review={review} />
                  ))}
                </div>
            ) : (
                <p className='noReviews'>No Reviews Yet</p>
            )}
          </Fragment>
        )
      }
    </Fragment>
  )
}

export default ProductDetails