import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isMobile, isIOS } from 'react-device-detect';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Dispatch } from 'redux';
import Homepage from '../Homepage/Homepage';
import Path from '../../utils/path/path';

import { RootState } from '../../store/store';
import { resizeWindow, WindowSizeStateType } from '../../store/window/slice';
import { setQueryObject } from '../../store/route/slice';

import ContainerModal from '../Modals/ContainerModal/ContainerModal';
import DialogModal from '../Modals/DialogModal/DialogModal';


import './App.scss';
import Webshop from '../Webshop/Webshop';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import CheckoutPage from '../CheckoutPage/CheckoutPage';
import ManagerPage from '../ManagerPage/ManagerPage';

interface MapStateToProps {
  windowSize: WindowSizeStateType;
  user: any;
}

interface DispatchProps {
  resizeWindow: (payload: any) => void;
  setQueryObject: (payload: any) => void;
}

type Props = MapStateToProps & DispatchProps;

const App: React.FC<Props> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mediaQueryList = window.matchMedia('(orientation: portrait)');

  useEffect(() => {
    setQueryObject();
    setupWindowSize();
    window.addEventListener('resize', setupWindowSize);

    return () => {
      window.removeEventListener('resize', setupWindowSize);
    };
  }, []);

  useEffect(() => {
    setQueryObject();
  }, [location.search]);

  const setQueryObject = () => {
    const { search } = location;
    const query = new URLSearchParams(search);
    props.setQueryObject(query);
  };

  const setupWindowSize = () => {
    if (isMobile) {
      const isPortrait = mediaQueryList.matches;
      if (isIOS && !isPortrait) {
        props.resizeWindow({
          width: window.screen.height,
          height: window.screen.width,
        });
      } else {
        props.resizeWindow({
          width: window.screen.width,
          height: window.screen.height,
        });
      }
    } else {
      props.resizeWindow({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  };

  return (
    <main
      className={`${isMobile ? 'mobile' : 'desktop'} ${
        props.windowSize.orientation
      } ${props.windowSize.windowClassType}`}
    >
      <div className="viewport">
        <div className="main-content">
        <Routes>
          <Route path={Path.mainPath} element={<Homepage navigate={navigate} />} />
          <Route path={Path.webshopPath} element={<Webshop navigate={navigate} />} />
          <Route path={Path.checkoutPath} element={<CheckoutPage navigate={navigate} />} />
          <Route path={Path.managerPath} element={<ManagerPage navigate={navigate} />} />
        </Routes>
        </div>
      </div>

      <ContainerModal />
      <DialogModal />
    </main>
  );
};

const mapStateToProps = (state: RootState) => ({
  windowSize: state.window.windowSize,
  user: state.user.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resizeWindow: (payload: any) => dispatch(resizeWindow(payload)),
  setQueryObject: (payload: any) => dispatch(setQueryObject(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);