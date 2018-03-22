function singlePostHandler() {
    const post_header = document.querySelector('.heading_wrapper');
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((el) => {
        hljs.highlightBlock(el);
    });
}

export {singlePostHandler};
