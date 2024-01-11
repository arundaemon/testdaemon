import React from 'react';
import { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { getAllActiveBanners } from '../../config/services/banners';

const useStyles = makeStyles((theme) => ({
  bgImg: {
    height: "8.4rem !important",
    color: "#fff",
    padding: "1rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },
  followUpBtn: {
    border: "1px solid #f45e29",
    backgroundColor: "#ffffff",
    padding: "3px 12px !important",
    marginTop: '20px'
  },
  bannerName: {
    textTransform: "upperCase",
    fontSize: "1rem",
  },
  bannerDesc: {
    textTransform: "capitalize",
    fontSize: "14px",
  },
}));

export default function Slider() {
  const classes = useStyles();
  const [banners, setBanners] = useState([]);

  // console.log(banners,"banners in Slider")
  const fetchAllActiveBanners = () => {
    getAllActiveBanners()
      .then((res) => {
        //  console.log(res.result)
        setBanners(res?.result)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => fetchAllActiveBanners(), []);

  return (
    <Carousel
      autoPlay={true}
      swipe={false}
      indicators={true}
      height="134px"
      navButtonsAlwaysInvisible={true}
      indicatorContainerProps={{
        style: {
          zIndex: 1,
          bottom: 0,
          position: "absolute",
        }
      }}
      indicatorIconButtonProps={{
        style: {
          color: '#ffffff50'
        }
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: '#ffffff'
        }
      }}
    >
      {
        banners?.map((item, i) => <Item key={i} item={item} />)
      }
    </Carousel>
  )
}

const handleBannerRedirect = (data) => {
  let { webBanner } = data
  // console.log(webBanner, '........data')
  if (webBanner?.redirectUrl && webBanner?.redirectToType === "text" && webBanner?.redirectUrl.includes("https://") === false) {
    var url = 'http://' + webBanner?.redirectUrl;
    var win = window.open(url, '_blank');
    win.focus();
  }
  else if (webBanner?.redirectUrl && webBanner?.redirectToType === "text" && webBanner?.redirectUrl.includes("https://")) {
    var win = window.open(webBanner?.redirectUrl, '_blank');
    win.focus();
  }
  else {
    var win = window.open(webBanner?.redirectUrl, '_blank');
    win.focus();
  }
}

function Item({item}) {
  const classes = useStyles();
  //console.log(item?.webBanner?.bannerUrl)
  return (
    <Paper className={classes.bgImg} style={{ backgroundImage: `url('${item?.webBanner?.bannerUrl}')` }} >
      <h6 className={classes.bannerName}>{item?.bannerName ?? '-'}</h6>
      <p className={classes.bannerDesc}>{item?.description ?? '-'}</p>

      <Button onClick={(e) => handleBannerRedirect(item)} className={classes.followUpBtn}>
        Know More
      </Button>
    </Paper>
  )
}