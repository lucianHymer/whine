import {
  FormLabel,
  FormControl,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'

const NumberField = ({
  id,
  label,
  value,
  setValue,
  step,
  min,
  max,
  precision,
  format,
  parse,
  pattern
}) => {
  return (
    <FormControl isRequired mt={4}>
      <FormLabel requiredIndicator='' htmlFor={id}>
        {label}
      </FormLabel>
      <InputGroup size='sm'>
        <NumberInput
          w='100%'
          value={format ? format(value) : value}
          onChange={valStr => setValue(parse ? parse(valStr) : valStr)}
          id={id}
          step={step}
          precision={precision}
          min={min}
          max={max}
          pattern={pattern}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
    </FormControl>
  )
}

export default NumberField
