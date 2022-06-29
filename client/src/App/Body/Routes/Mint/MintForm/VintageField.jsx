import NumberField from './NumberField';

const VintageField = ({vintage, setVintage}) => {
  return <NumberField
    id='vintage'
    label='Vintage'
    value={vintage}
    setValue={setVintage}
    step={1}
    precision={0}
    min={1960}
    max={new Date().getUTCFullYear()}
  />
};


export default VintageField;
