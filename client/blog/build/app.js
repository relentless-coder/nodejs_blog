webpackJsonp([0],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return comment; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comment_factory__ = __webpack_require__(11);


function comment() {
  const postComment = url => {
    console.log(document.getElementById('comment_name').value, document.getElementById('comment_email').value, document.getElementById('author_new_comment').value);
    const data = {
      author: {
        name: document.getElementById('comment_name').value,
        email: document.getElementById('comment_email').value
      },
      comment: document.getElementById('author_new_comment').value
    };
    __WEBPACK_IMPORTED_MODULE_0__comment_factory__["a" /* default */].postComment(data, url).then(data => {
      const commentWrapper = document.querySelector('.comment_wrapper');
      const result = Handlebars.templates['comment'](data.data);
      console.log(result);
      commentWrapper.insertAdjacentHTML('beforeend', result);
    });
  };

  const replyComment = (comment, id) => {
    __WEBPACK_IMPORTED_MODULE_0__comment_factory__["a" /* default */].replyComment(comment, id);
  };

  return {
    postComment, replyComment
  };
}



/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


function commentFactory() {
  const postComment = (comment, url) => {
    console.log('comment is ', comment);
    return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post(`/post/${url}/comment`, comment);
  };

  const replyComment = (data, id, url) => {
    return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post(`/post/${url}/comment/${id}`, data);
  };

  return {
    postComment, replyComment
  };
}

/* harmony default export */ __webpack_exports__["a"] = (commentFactory());

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return singlePostHandler; });
function singlePostHandler() {
  const post_header = document.querySelector('.heading_wrapper');
  window.addEventListener('scroll', e => {
    e.preventDefault();
    if (window.scrollY > 800) {
      if (!post_header.classList.contains('hide')) post_header.classList.add('hide');
    } else {
      if (post_header.classList.contains('hide')) post_header.classList.remove('hide');
    }

    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(el => {
      hljs.highlightBlock(el);
    });
  });
}



/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__views_comments_comment__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_posts_single_post_single_post__ = __webpack_require__(30);



Object(__WEBPACK_IMPORTED_MODULE_1__views_posts_single_post_single_post__["a" /* singlePostHandler */])();
window.commentWrapper = Object(__WEBPACK_IMPORTED_MODULE_0__views_comments_comment__["a" /* comment */])();

/***/ })

},[9]);