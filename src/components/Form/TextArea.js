import { Textarea } from '@chakra-ui/react'

const TextAreaField = ({title, setBio}) => {
  return (
    <div>
     <Textarea placeholder={title} className="textarea_field" onChange={(e) => setBio(e.target.value)}/>
    </div>
  );
};

export default TextAreaField;
