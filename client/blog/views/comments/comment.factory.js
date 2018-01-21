import axios from 'axios'

function commentFactory() {
  const postComment = (comment, url)=>{
    console.log('comment is ', comment)
    return axios.post(`/post/${url}/comment`, comment);
  }

  const replyComment = (data, id, url)=>{
    return axios.post(`/post/${url}/comment/${id}`, data)
  }

  return {
    postComment, replyComment
  }
}

export default commentFactory()