import axios from 'axios';

function commentFactory() {
    const postComment = (comment, postId)=>{
        return axios.post(`/post/${postId}/comment`, comment);
    };

    const replyComment = (data, postId, commentId)=>{
        return axios.post(`/post/${postId}/comment/${commentId}`, data);
    };

    return {
        postComment, replyComment
    };
}

export default commentFactory();