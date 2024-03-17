import React from 'react';
import {
    Image
  } from "react-native";

  const Sprite = ({spriteDown, spriteLeft}) => {
      const spriteWidth = 50
      const spriteHeight = 60

    return (
        <Image
        source={require('./assets/heart.png')}
         style={{
            position: 'absolute',
            width: spriteWidth,
            height: spriteHeight,
            left: spriteLeft,
            bottom: spriteDown - (spriteHeight/2),
            resizeMode: 'stretch'
        }}/>
    )
  }//Sprite

  export default Sprite