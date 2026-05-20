import { Button } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function createData(Buyer, Gig, Due, Total, Status) {
    return { Buyer, Gig, Due, Total, Status };
}


const OrderTabel = (props) => {
    const rows = [
        createData
            (
                <>
                    <div className='poppins d-flex align-items-center'>
                        <img src={props.user} width={50} height={50} alt="w8" style={{ clipPath: 'circle(50%)' }} />
                        <div className='ms-2'>
                            <p className="font-16  mb-0" >{props.userName}</p>
                        </div>
                    </div>
                </>,
                <p className="mb-0 font-16 poppins">{props.GigTitle}</p>,
                <p className="mb-0 font-16 poppins">{props.date}</p>,
                <p className="mb-0 font-16 poppins">{props.price}</p>,
                <Button className='btn-stepper poppins px-3 p-1  font-16'>
                  {props.btn}
                </Button>)
     
      
      
    ].sort((a, b) => (a.Gig < b.Gig ? -1 : 1));
    return (
        <>



                   
                                    {rows.map((row) => (
                                        <TableRow key={row.Buyer}>
                                            <TableCell className='ps-4' sx={{ width: '30%' }} >
                                                {row.Buyer}
                                            </TableCell>
                                            <TableCell sx={{ width: '30%' }} align='center'>
                                                {row.Gig}
                                            </TableCell>
                                            <TableCell  align='center'>
                                                {row.Due}
                                            </TableCell>
                                            <TableCell  align='center'>
                                                {row.Total}
                                            </TableCell>
                                            <TableCell  align='center'>
                                                {row.Status}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                 
                           

           



        </>
    )
}

export default OrderTabel 
