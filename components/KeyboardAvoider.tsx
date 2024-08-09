import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  KeyboardEvent,
  Keyboard,
  findNodeHandle,
  TextInput,
  Animated,
  Easing,
  Platform,
  Dimensions,
  ScaledSize,
} from "react-native";

interface Props {
  yOffset?: number;
}

const KeyboardAvoider: React.FC<Props> = ({ yOffset = 10, children }) => {
  const ref = useRef(null);
  const [kbOffset, setKbOffset] = useState(0);
  const kbOffsetAnim = useRef(new Animated.Value(0)).current;

  const isPortrait = useState(checkIsPortrait(Dimensions.get("screen")));
  const [justRotated, setJustRotated] = useState(false);

  const updateOffset = (toValue: number) => {
    setKbOffset(toValue);

    const didJustRotate = justRotated;
    const duration = didJustRotate ? 1000 : 100;
    const easing = didJustRotate ? null : Easing.out(Easing.ease);
    if (didJustRotate) setJustRotated(false);

    Animated.timing(kbOffsetAnim, {
      toValue: -toValue,
      duration: duration,
      useNativeDriver: true,
      easing: easing,
    }).start();
  };

  useEffect(() => {
    const kbShow = Keyboard.addListener(
      Platform.select({ ios: "keyboardWillShow", android: "keyboardDidShow" }),
      onKeyboardShow
    );
    const kbHide = Keyboard.addListener(
      Platform.select({ ios: "keyboardWillHide", android: "keyboardDidHide" }),
      onKeyboardHide
    );

    const onOrientationChange = () => {
      const portrait = checkIsPortrait(Dimensions.get("screen"));
      setJustRotated(!isPortrait && portrait);
      isPortrait = portrait;
    };

    if (Platform.OS === "android") {
      Dimensions.addEventListener("change", onOrientationChange);
    }

    return () => {
      kbShow.remove();
      kbHide.remove();
      Dimensions.removeEventListener("change", onOrientationChange);
    };
  }, []);

  const onKeyboardShow = (e: KeyboardEvent) => {
    setTimeout(() => {
      const textRef = TextInput.State.currentlyFocusedInput();
      textRef && measureTextInput(textRef, e);
    }, 100);
  };

  const measureTextInput = (textRef: any, e: KeyboardEvent) => {
    const topY = e.endCoordinates.screenY;

    textRef.measureLayout(
      findNodeHandle(ref.current),
      (x: number, y: number) => {
        const pageY = y;

        textRef.measure(
          (x: number, y: number, width: number, height: number) => {
            const textInputY = pageY - kbOffset + height + yOffset; // y coordinate of the bottom of this component
            const offset = textInputY > topY ? textInputY - topY : 0;

            if (Platform.OS === "android")
              updateOffset(Math.min(offset, yOffset));
            else updateOffset(offset);
          }
        );
      },
      () => {}
    );
  };

  const onKeyboardHide = (e: KeyboardEvent) => {
    updateOffset(0);
  };

  return (
    <Animated.View
      ref={ref}
      style={[styles.container, { transform: [{ translateY: kbOffsetAnim }] }]}
    >
      {children}
    </Animated.View>
  );
};

const checkIsPortrait = (dims: ScaledSize) => {
  return dims.width < dims.height;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardAvoider;
