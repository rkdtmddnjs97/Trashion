import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Navbar, MypageProductList, Review, List_Null_Scrap, Scrap_product, AccountMenu } from 'components';
import Fab from '@mui/material/Fab';
import styles from './MyPage.module.css';
import { userInfoState, authState, reviewState } from 'store';
import { setCookie, getCookie } from 'cookies-next';
import authApi from 'api/authApi';
import user from 'api/userInfo';
import reviewApi from 'api/reviewApi';
import userimg from 'assets/image/userimg.png';

export default function MyPage() {
  const [userAuth, setUser] = useRecoilState(authState); //로그인 정보
  const [userInfo, setUserInfo] = useRecoilState(userInfoState); //유저 개인 정보
  const user_id = userAuth.user_id;
  const navigate = useNavigate();
  const [, setReview] = useRecoilState(reviewState);

  const handleLogout = async () => {
    console.log(getCookie('access_token'));
    await authApi
      .getUser()
      .then(() => {
        setUser({
          isLoggedIn: false,
          access_token: setCookie(-1),
          refresh_token: setCookie(-1),
        });
      })
      .catch((err) => {
        setUser({
          isLoggedIn: false,
          access_token: setCookie(-1),
          refresh_token: setCookie(-1),
        });
      });
    navigate('/');
  };

  useEffect(() => {
    user.getUserInfo(user_id).then((res) => {
      reviewApi.getReview().then((res) => {
        setReview(res.data.results);
      });
      setUserInfo({
        nickname: res.data.nickname,
        following_amount: res.data.following_count,
        follower_amount: res.data.follower_count,
        height: res.data.profile.height,
        weight: res.data.profile.weight,
        top_size: res.data.profile.top_size,
        bottom_size: res.data.profile.bottom_size,
        introduce: res.data.profile.introduce,
        like_item_count: res.data.like_item_count,
        likeitem_sets: res.data.likeitem_sets,
        sold_out_count: res.data.sold_out_count,
      });
      if (res.data.social_profile) {
        setUserInfo((userInfo) => ({ ...userInfo, social_profile: res.data.social_profile }));
      } else if (res.data.profile_image) {
        setUserInfo((userInfo) => ({ ...userInfo, profile_image: res.data.profile_image.photo }));
      }
    });
  }, []);

  let profile_img;

  if (userInfo.social_profile) {
    profile_img = userInfo.social_profile;
  } else if (userInfo.profile_image) {
    profile_img = userInfo.profile_image;
  } else {
    profile_img = userimg;
  }

  return (
    <div>
      <Navbar />
      <AccountMenu />
      <div className={styles.MyPage_bodybox}>
        <div className={styles.MyPage_bodyleft}>
          <div className={styles.Mypage_profileImgbox}>
            <img className={styles.Mypage_profileImg} src={profile_img} />
          </div>
        </div>
        <div className={styles.MyPage_bodyright}>
          <div className={styles.Mypage_profilecontentsbox}>
            <h2>{userInfo.nickname} </h2>
            <h3> {userInfo.introduce} </h3>
            <div className={styles.Mypage_profilecontentsboxinner}>
              <div className={styles.Mypage_profilecontentsboxinnerright}>
                <p> 팔로워 : {userInfo.follower_amount}</p>
                <p> 키 : {userInfo.height}</p>
                <p> 상의사이즈 : {userInfo.top_size}</p>
                <p>거래완료수 : {userInfo.sold_out_count}</p>
              </div>
              <div>
                <p> 팔로잉 : {userInfo.following_amount}</p>
                <p> 몸무게 : {userInfo.weight}</p>
                <p> 하의사이즈 : {userInfo.bottom_size}</p>
                <p>
                  내가 찜한 아이템 : <Link to={userInfo.like_item_count === '0' ? <List_Null_Scrap /> : <Scrap_product />}>{userInfo.like_item_count}</Link>
                </p>
              </div>
            </div>
            <div>
              <h3> 최근 리뷰 </h3>
            </div>
            <div className={styles.Mypage_reviewbox}>
              <Review />
            </div>
            <div className={styles.Mypage_buttonbox}>
              <Link to="/New_Profile">
                <Fab variant="extended" sx={{ width: '8rem', bgcolor: '#f8bbd0', ml: '1rem', mr: '1rem', fontWeight: 'bolder' }}>
                  내 정보 수정
                </Fab>
              </Link>
              <Fab variant="extended" onClick={handleLogout} sx={{ width: '8rem', bgcolor: '#f8bbd0', ml: '1rem', fontWeight: 'bolder' }}>
                로그아웃
              </Fab>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.MyPage_list}>
        <p className={styles.MyPage_list_title}>내가 쓴 글</p>
        <hr className={styles.Mypage_hr} />
        <div className={styles.MypageProductList}>
          <MypageProductList user_id={user_id} />
        </div>
      </div>

      {/* <div className={styles.MyPage_footerbox}>
        <Footer />
      </div> */}
    </div>
  );
}
