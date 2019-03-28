import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faTimes,
  faPencilAlt
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as farThumbsUp } from "@fortawesome/free-regular-svg-icons";

library.add(farThumbsUp);
library.add(faThumbsUp);
library.add(faTimes);
library.add(faPencilAlt);

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "Lyna",
      userID: 1,
      messageID: 9,
      isLiked: false,
      isDeleted: false,
      isEditable: false,
      messageContent: this.props.messageText,
      likeCount: 0,
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE1NTM3OTg1NjEsImV4cCI6MTU1NDQwMzM2MSwiaWF0IjoxNTUzNzk4NTYxfQ.HbyeRuAO0KD5Zwj1h5fyv7dm8Iodin0M_2V9akuVBd8"
    };
  }

  componentDidMount() {
    this.isLikedAPI();
    this.getLikeCount();
  }

  getLikeCount() {
    axios
      .get(`http://localhost:5000/api/messages/` + this.state.messageID)
      .then(response => {
        this.setState({ likeCount: response.data });
      });
  }

  isLikedAPI() {
    var headers = {
      messageId: this.state.messageID,
      userId: this.state.userID,
      Authorization: this.state.Authorization
    };
    axios
      .get(`http://localhost:5000/api/messages/isliked`, { headers })
      .then(response => {
        if (this.state.isLiked == response.data) {
          return null;
        }
        this.setState({ isLiked: response.data });
      });
  }

  likeMessage() {
    var header = {
      messageId: this.state.messageID,
      userId: this.state.userID,
      Authorization: this.state.authorization
    };
    var newCount = this.state.likeCount;
    if (this.state.isLiked) {
      axios.post(
        `http://localhost:5000/api/messages/RemoveLike`,
        {},
        { headers: header }
      );
      newCount--;
    } else {
      axios.post(
        `http://localhost:5000/api/messages/AddLike`,
        {},
        { headers: header }
      )
      newCount++;
    }
    this.setState({likeCount: newCount})
    this.setState({ isLiked: !this.state.isLiked });
  }

  editMessage = e => {
    if (e.key === "Enter") {
      var header = {
        id: this.state.messageID,
        Messagecontent: e.target.value,
        Authorization: this.state.authorization
      };
      axios.put(
        `http://localhost:5000/api/messages/EditMessage`,
        {},
        { headers: header }
      );
      this.setState({ isEditable: false });
      this.setState({ messageContent: e.target.value });
    }
  };

  showTextArea() {
    this.setState({ isEditable: true });
  }

  deleteMessage() {
    var header = {
      id: this.state.messageID,
      Authorization: this.state.authorization
    };
    axios.delete(`http://localhost:5000/api/messages`, { headers: header });
    this.setState({ isDeleted: true });
  }

  render() {
    if (this.state.isLiked) {
      var likeIcon = faThumbsUp;
    } else {
      var likeIcon = farThumbsUp;
    }

    return (
      <div className={this.state.isDeleted ? "displayNone" : "mainContainer"}>
        <div className="SenderInfoContainer">
          <Image
            className="message-user-img"
            src="https://i2.wp.com/crimsonems.org/wp-content/uploads/2017/10/profile-placeholder.gif?fit=250%2C250&ssl=1"
            roundedCircle
          />
          <div className="UserNameAndTimeContainer">
            <span>
              <b>{this.state.username}</b>
            </span>
            <span>{this.props.currentTime} </span>
          </div>
        </div>
        <span className="message-buttons">
          <button
            className="btn btn-default"
            onClick={this.likeMessage.bind(this)}
          >          {this.state.likeCount}
            <FontAwesomeIcon icon={likeIcon} />
          </button>
          <button
            className="btn btn-default"
            onClick={this.showTextArea.bind(this)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          <button
            className="btn btn-default"
            onClick={this.deleteMessage.bind(this)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </span>
        <div className="messageContainer">
          {!this.state.isEditable ? (
            <span><p>{this.state.messageContent}</p></span>
          ) : (
            <input
              type="text"
              onKeyPress={e => this.editMessage(e)}
              defaultValue={this.state.messageContent}
              className="editableMessageText"
            />
          )}
        </div>
      </div>
    );
  }
}

export default Message;
