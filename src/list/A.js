//@flow
// List-to-Array converter
export default function A/*::<List>*/(list/*:List*/)/*:$ElementType<List,number>[]*/ {
    return [].slice.call(list);
}
