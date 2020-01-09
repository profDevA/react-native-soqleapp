import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  container: {
    height: 200,
    width: 300,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: '#9600A1'
  },
  headingText: {
    color: "#9600A1",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20
  },
  submitButton: {
    width: 80,
    paddingVertical: 10,
    backgroundColor: "#9600A1",
    borderRadius: 100,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20, 
  },
  submitText: {
    color: "#fff",
    fontSize: 20
  },
  iconContainer: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 7,
    right: -10
  },
  closeIcon: {
    fontSize: 20
  }
});
