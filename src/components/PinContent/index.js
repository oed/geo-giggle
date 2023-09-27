import { useEnsName } from 'wagmi'

const PinContent = ({ pin }) => {
  const address = pin.author.id.split(':')[4]
  const { data: ensName, isError, isLoading } = useEnsName({ address })

  return (
    <p>
      <b>Name:</b>
      <br />
      {pin.name}
      <hr />
      <b>Description:</b>
      <br />
      {pin.description}
      <hr />
      <b>Category:</b>
      <br />
      {pin.tag}
      <hr />
      <b>author:</b>
      <br />
      {ensName || address}
    </p>
  );
};

export default PinContent;
