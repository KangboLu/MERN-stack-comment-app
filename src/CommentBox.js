// CommentBox.js
import React, { Component } from 'react';
import axios from 'axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
// import DATA from './data'; // testing data
import style from './style';

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleCommentUpdate = this.handleCommentUpdate.bind(this);
    this.handleCommentDelete = this.handleCommentDelete.bind(this);
  }
  // load comment from server through GET request
  loadCommentsFromServer() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ data: res.data });
      })
  }
  // handle comment submition through POST request
  handleCommentSubmit(comment) {
  let comments = this.state.data;
  comment._id = Date.now();
  let newComments = comments.concat([comment]);
  this.setState({ data: newComments });
  axios.post(this.props.url, comment)
    .catch(err => {
      console.error(err);
      this.setState({ data: comments });
    });
  }
  // handle comment update through PUT request
  handleCommentUpdate(id, comment) {
    axios.put(`${this.props.url}/${id}`, comment)
      .then(res => {
        console.log('Comment updated');
      })
      .catch(err => {
        console.log(err);
      });
  }
  // handle comment delete through DELETE request
  handleCommentDelete(id) {
    axios.delete(`${this.props.url}/${id}`)
      .then(res => {
        console.log('Comment deleted');
      })
      .catch(err => {
        console.error(err);
      });
  }
  // after component mounted load with certain interval
  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }
  render() {
    return (
      <div style={ style.commentBox }>
        <h2 style={ style.title }>Comments:</h2>
        <CommentList
          onCommentDelete={ this.handleCommentDelete }
          onCommentUpdate={ this.handleCommentUpdate } 
          data = { this.state.data }/>
        <CommentForm onCommentSubmit={ this.handleCommentSubmit }/>
      </div>
    )
  }
}

export default CommentBox;