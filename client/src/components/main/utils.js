 const formatQuestionText = (text) => {
    const regex = /\[(.*?)\]\((.*?)\)/g;
    const formattedText = text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    return { __html: formattedText };
};


 module.exports = formatQuestionText;
