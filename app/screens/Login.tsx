import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { Colors } from "../config/color";
import OutlinedText from "../components/OutlineText";
import { useAuth } from "../context/AuthContext";
import { arrayEquals } from "../utililty/utils";
import * as ScreenOrientation from "expo-screen-orientation";

function verifyPassword(password: string, confirmPassword?: string): string[] {
  const errors = [];

  // Check if password is at least 8 characters long
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  // Check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  // Check if password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  // Check if password contains at least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  // Check if password contains at least one special character
  if (!/[\W_]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  if (confirmPassword !== undefined && confirmPassword !== password) {
    errors.push("Password do not match.");
  }

  return errors;
}

function verifyUsername(username: string): string[] {
  const errors = [];

  // Check if username length is between 3 and 30 characters
  const length = username.length;
  if (length < 3 || length > 30) {
    errors.push("Username length must be between 3 and 30 characters.");
  }

  return errors;
}

const RegisterPage = ({
  username,
  setUsername,
  password,
  setPassword,
  setRegister,
}: {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  setRegister: (value: boolean) => void;
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const { onRegister } = useAuth();

  const getNewErrors = (ignoreEmpty?: boolean) => [
    ...(ignoreEmpty && password.length === 0
      ? []
      : verifyPassword(
          password,
          ignoreEmpty && password.length === 0 ? undefined : confirmPassword
        )),
    ...(ignoreEmpty && username.length === 0 ? [] : verifyUsername(username)),
  ];

  const [errors, setErrors] = useState<string[]>(getNewErrors(true));

  const updateErrors = () => {
    const newErrors = getNewErrors();
    // Avoid rerender when no errors change.
    if (!arrayEquals(newErrors, errors)) {
      setErrors(newErrors);
    }
  };

  return (
    <View style={styles.container}>
      <OutlinedText
        height={60}
        fontFamily={"Kanit_900Black"}
        fontSize={32}
        strokeWidth={3}
      >
        Register to RiskQuest
      </OutlinedText>
      <View style={styles.errors}>
        {errors.map((error) => (
          <Text style={styles.error} key={error}>
            {error}
          </Text>
        ))}
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={"Usename"}
          value={username}
          onChangeText={(text) => setUsername(text)}
          autoComplete={"username"}
          onEndEditing={updateErrors}
        />
        <TextInput
          style={styles.input}
          placeholder={"Password"}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoComplete={"new-password"}
          onEndEditing={updateErrors}
        />
        <TextInput
          style={styles.input}
          placeholder={"Confirm password"}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          autoComplete={"new-password"}
          onEndEditing={updateErrors}
        />
        <Button
          color={Colors.mainButton}
          title={"Register"}
          onPress={async () => {
            const newErrors = getNewErrors();

            if (!arrayEquals(newErrors, errors)) {
              setErrors(newErrors);
            }

            if (newErrors.length === 0) {
              const response = await onRegister!(username, password);
              if (response?.success === true) {
                setRegister(false);
              } else {
                setErrors(
                  Array.isArray(response?.error)
                    ? response.error
                    : response?.error
                    ? [response.error]
                    : ["Unknown error"]
                );
              }
            }
          }}
        />
        <View style={styles.signup}>
          <Text>Already have an account?</Text>
          <TouchableHighlight onPress={() => setRegister(false)}>
            <Text style={styles.textBtn}>Login now</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

const LoginPage = ({
  username,
  setUsername,
  password,
  setPassword,
  setRegister,
}: {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  setRegister: (value: boolean) => void;
}) => {
  const { onLogin, onGuest } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);

  const getNewErrors = () => {
    const errors: string[] = [];
    if (password.length === 0) errors.push("Please enter a password");
    if (username.length === 0) errors.push("Please enter a username");
    return errors;
  };

  return (
    <View style={styles.container}>
      <OutlinedText
        height={60}
        fontFamily={"Kanit_900Black"}
        fontSize={32}
        strokeWidth={3}
      >
        Welcome to RiskQuest
      </OutlinedText>
      <View style={styles.errors}>
        {errors.map((error) => (
          <Text style={styles.error} key={error}>
            {error}
          </Text>
        ))}
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={"Enter your usename"}
          value={username}
          onChangeText={(text) => setUsername(text)}
          autoComplete={"username"}
        />
        <TextInput
          style={styles.input}
          placeholder={"Enter your password"}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoComplete={"current-password"}
        />
        <Button
          color={Colors.mainButton}
          title={"Login"}
          onPress={async () => {
            const newErrors = getNewErrors();

            if (!arrayEquals(newErrors, errors)) {
              setErrors(newErrors);
            }

            if (newErrors.length === 0) {
              const response = await onLogin!(username, password);
              if (response?.success !== true) {
                setErrors(
                  Array.isArray(response?.error)
                    ? response.error
                    : response?.error
                    ? [response.error]
                    : ["Unknown error"]
                );
              }
            }
          }}
        ></Button>
        <View style={styles.signup}>
          <Text>Don't have an account?</Text>
          <TouchableHighlight onPress={() => setRegister(true)}>
            <Text style={styles.textBtn}>Signup</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={styles.guestBox}
          onPress={async () => {
            const response = await onGuest!();
            if (response?.success !== true) {
              setErrors(
                Array.isArray(response?.error)
                  ? response.error
                  : response?.error
                  ? [response.error]
                  : ["Unknown error"]
              );
            }
          }}
        >
          <Text style={styles.textBtn}>Continue as a guest</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);

  useEffect(() => {
    // Lock to portrait orientation
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  return (
    <SafeAreaView>
      {register ? (
        <RegisterPage
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setRegister={setRegister}
        />
      ) : (
        <LoginPage
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setRegister={setRegister}
        />
      )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 25,
    fontFamily: "Noto",
    fontWeight: 900,
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 2,
    color: "white",
  },
  form: {
    gap: 10,
    width: "80%",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  signup: {
    gap: 10,
    flexDirection: "row",
  },
  textBtn: {
    color: Colors.mainButton,
  },
  guestBox: {
    width: "100%",
    alignItems: "center",
  },
  errors: {
    height: 120,
  },
  error: {
    color: Colors.errorText,
  },
});
