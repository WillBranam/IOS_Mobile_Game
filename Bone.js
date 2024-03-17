import React from 'react';
import {
    Image, View,
  } from "react-native";

  const Bone = ({ BoneBottom , BoneLeft }) => {
      const boneWidth = 100
      const boneHeight = 60

      return (
        <>
          <View
            style={{
              position: "absolute",
              width: boneWidth,
              height: boneHeight,
              left: BoneLeft + boneWidth + 120,
              bottom: BoneBottom,
              color: 'black'
            }}
          >
            {/* <Image source={require('./assets/undertale bone.png')} style={{ width: 300,height: 60,resizeMode: 'stretch', }}/> */}
          </View>
        </>
      );
  }//Sprite

  export default Bone