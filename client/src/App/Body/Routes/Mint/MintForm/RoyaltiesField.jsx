import NumberField from './NumberField';

const RoyaltiesField = ({royalties, setRoyalties}) => {
  return <NumberField
    id='royalties'
    label='Royalties'
    value={royalties}
    setValue={setRoyalties}
    step={0.1}
    precision={2}
    min={0}
    max={50}
    format={(val) => val + '%'}
    parse={(val) => val.replace(/\s*%\s*$/).trim()}
    pattern={"^[0-9]*\\.?[0-9]*%?$"}
  />
};

export default RoyaltiesField;
