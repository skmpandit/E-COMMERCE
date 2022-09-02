import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.png"
import "./Footer.css"

const Footer = () => {
  return (
    <footer id='footer'>
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download app for Android and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="AppsStore" />
        </div>
        <div className="midFooter">
            <h1>ECOMMERCE</h1>
            <p>High Quality is our first priority</p>
            <p>Copyrights 2022 &copy; SonuKumar</p>
        </div>
        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="https://www.facebook.com/profile.php?id=100015116558924">Facebook</a>
            <a href="https://www.facebook.com/profile.php?id=100015116558924">Instagram</a>
            <a href="https://www.facebook.com/profile.php?id=100015116558924">Youtube</a>
        </div>
    </footer>
  )
}

export default Footer