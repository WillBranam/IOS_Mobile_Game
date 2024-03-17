/* Will Branam - TiltGameBranam

Description: My app is an Undertale themed game where the user avoids falling bones to survive,
each bone avoided awards one point, and the score at the end is the total amount of 
bones avoided at the end of one game. 

Function: My app uses an accelerometer to move the sprite at the bottom. I decided to use an
accelerometer because I liked how constant the movement felt, it was more controllable and 
smooth feeling to me. I originally started with the gyroscope but quickly switched due to the
simpler nature of calculating movement based on direction rather than angle. accelerometer also
works better for my game because it is 2d and therefore a constant direction is more intuitive
than an angle.

my sprite and obstacles move based on different useEffects with intervals set at 30. at these
intervals their movement is updated, simulating animation. Using various hooks, I conditionally
render different components and start/stop movement. On defeat, there is a button which will reset
the game.

Bugs/limitations:
the hit box of the bone does not 100% align with the image and can feel off
the hit box is not great on side registering
the obstacles will render predictable the first two times
movement can't be stopped after game ends or it won't work again
score is only earned after the obstacles are rerendered
occasionally the collision won't be detected
*/

import React, { useState, useEffect } from "react";
import {
  Pressable,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import Sprite from "./Sprite";
import Obstacles from "./Obstacles";
import Bone from "./Bone";

export default function App() {
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;
  const spriteLeft = screenWidth / 2;
  const spriteRight = screenWidth / 2;
  const [spriteBottom, setSpriteBottom] = useState(screenHeight / 8);
  const [boneBottom, setBoneBottom] = useState(screenHeight/2)
  const [boneLeft, setBoneLeft] = useState(screenWidth/2)
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth/2);
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(
    screenWidth + screenWidth / 2 + 30
  );
  const [isGameOver, setIsGameOver]= useState(false)
  const [highScore, setHighScore] = useState(0)
  const [score, setScore]= useState(0)
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0);
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0);

  const obstacleWidth = 200;
  const obstacleHeight = 60;
  const gap = 120;
  const gravity = 3;
  let gameTimerID;
  let obstaclesLeftTimerID;
  let obstaclesLeftTimerIDTwo;
  let boneBottomTimerID
  const [count, setCount] = useState(0)
  const [position, setPosition] = useState(screenWidth / 2)
  const [rendered, setRendered] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };//method for adding accelerometer listener

  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };//method for unsubscribing

  useEffect(() => {
      setIsGameOver(true)
    _subscribe();
    return () => _unsubscribe();
  }, []);//subscribe use effect

  const { x, y, z } = data;



  //sprite
  // useEffect(() => {
  //   if (spriteBottom > 0) {
  //     gameTimerID = setInterval(() => {
  //       setSpriteBottom((spriteBottom) => spriteBottom - gravity);

  //     }, 30);
  //     return () => {
  //       clearInterval(gameTimerID);
  //     };
  //   }
  // }, [spriteBottom]);

  //first obstacle
  useEffect(() => {
    if (!isGameOver){
    if (obstaclesLeft > -obstacleWidth) {
      obstaclesLeftTimerID = setInterval(() => {
        setObstaclesLeft((obstaclesLeft) => obstaclesLeft - 5);
      }, 30);
      return () => {
        clearInterval(obstaclesLeftTimerID);
      };
    } else {
      setScore(score => score +1)
      setObstaclesLeft(screenWidth);
      setObstaclesNegHeight(200 +(-Math.random() * 200));
    }
  }
  }, [obstaclesLeft]);

  //second obstacle
  useEffect(() => {
    if (!isGameOver){
    if (obstaclesLeftTwo > -obstacleWidth) {
      obstaclesLeftTimerIDTwo = setInterval(() => {
        setObstaclesLeftTwo((obstaclesLeftTwo) => obstaclesLeftTwo - 5);
      }, 30);
      return () => {
        clearInterval(obstaclesLeftTimerIDTwo);
      };
    } else {
      setScore(score => score +1)
      setObstaclesLeftTwo(screenWidth);
      setObstaclesNegHeightTwo(200 +(-Math.random() * 200));
    }
  }
  }, [obstaclesLeftTwo]);

//moving the sprite
  useEffect(() => {
    let temp = position + data.x * 30;
    if(temp < 0 || temp > screenWidth){
        setPosition(0);
      }
      else if(temp > screenWidth+30){
        setPosition(screenWidth+30);
      }
    else{
      setPosition(temp);
    }
    //console.log(position)
  },[data])


useEffect(() => {
  if (isTouching()){
    gameOver();
  }
})

// obstaclesNegHeight = left (x) sprite width = 50 sprite height = 60
// obstaclesLeft = bottom (y)  obstacle width = 200 obstacle height = 60
//position = left(x)
//spriteBottom = bottom (y)
  const isTouching = () => {
    if (!isGameOver){
      if ((position + 50 < obstaclesNegHeight + 200 &&
        position + 100 > obstaclesNegHeight &&
        spriteBottom + 30 < obstaclesLeft + 60 &&
        spriteBottom + 60 > obstaclesLeft + 30) 
        ||
        (position + 50 < obstaclesNegHeightTwo + 200 &&
          position + 100 > obstaclesNegHeightTwo &&
          spriteBottom + 30 < obstaclesLeftTwo + 60 &&
          spriteBottom + 60 > obstaclesLeftTwo + 30)) {
          return true // collision detected!
      }//if
      else  {
        return false
      }//else
    }//gameOver
  }//is touching

  const gameOver = () => {
    clearInterval(gameTimerID)
    clearInterval(obstaclesLeftTimerID)
    clearInterval(obstaclesLeftTimerIDTwo)
    setIsGameOver(true)
    if (score > highScore){
      setHighScore(score)
    }
    setModalVisible(true)
  }//gameOver

  const pressHandler = () => {
    setRendered(true)
    setIsGameOver(false)
    setObstaclesNegHeight(0)
    setObstaclesNegHeightTwo(0)
    setScore(0)
    setSpriteBottom(screenWidth / 2)
    setObstaclesLeft(screenWidth)
    setObstaclesLeftTwo(screenWidth + screenWidth / 2 + 30)
    setModalVisible(false)
  }//pressHandler

  const modalHandler = () => {
    setIsGameOver(false)
    setRendered(true)
  }

  return (
    <View style={styles.container}>
      <Image source={require('./assets/sans.gif')} style={{width: 200, height: 200, justifyContent: 'flex-start', marginTop: '20%', resizeMode: 'stretch'}}/>
      {!rendered ? <Modal
        animationType="slide"
        transparent={true}
        visible={!rendered}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setRendered(!rendered);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 15}}>Directions</Text>
            <Text style={styles.modalText}>Oh no! Sans is throwing bones at you. Tilt your device to avoid them and earn score</Text>
            <Pressable
              style={[styles.buttonM, styles.buttonClose]}
              onPress={() => pressHandler()}
            >
              <Text style={styles.textStyle}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>: null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 15}}>Game Over</Text>
            <Text style={styles.modalText}>High Score: {highScore}</Text>
            <Text style={styles.modalText}>Current Score: {score}</Text>
            <Pressable
              style={[styles.buttonM, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Continue</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
      <Sprite spriteDown={spriteBottom} spriteLeft={position} />
      <Obstacles
        obstaclesLeft={obstaclesLeft}
        obstacleWidth={obstacleWidth}
        obstacleHeight={obstacleHeight}
        randomBottom={obstaclesNegHeight}
        gap={gap}
      />
      <Obstacles
        obstaclesLeft={obstaclesLeftTwo}
        obstacleWidth={obstacleWidth}
        obstacleHeight={obstacleHeight}
        randomBottom={obstaclesNegHeightTwo}
      />
      {isGameOver ? <TouchableOpacity onPress={pressHandler} style={styles.button}>
                        <Image source={require('./assets/reset_button.png')}
                          style={{resizeMode: 'stretch', width: 300, height: 300}}
                        />
                    </TouchableOpacity>: null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonM: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
  },
  
});

