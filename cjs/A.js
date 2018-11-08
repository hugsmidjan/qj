//@flow
// List-to-Array converter
function A/*::<List>*/(list/*:List*/)/*:$ElementType<List,number>[]*/ {
    return [].slice.call(list);
}

module.exports = A;
