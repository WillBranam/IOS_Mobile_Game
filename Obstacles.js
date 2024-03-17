import React from "react";
import {
  View,
  Image,
} from "react-native";

const Obstacles = ({ randomBottom, obstaclesLeft, obstacleWidth, obstacleHeight, }) => {
  return (
    <>
      <Image
        source={require('./assets/bone.png')}
        style={{
          position: "absolute",
          width: obstacleWidth,
          height: obstacleHeight,
          left: randomBottom,
          bottom: obstaclesLeft,
          resizeMode: 'stretch'
        }}
      />
    </>
  );
};

export default Obstacles;
