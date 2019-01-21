import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Header from './layout/Header';

// import SendMessageRequest from './consumer/SendMessageRequest';
// import SendMessageReply from './consumer/SendMessageReply';
// import Inbox from './consumer/Inbox';

import { Container, Row, Col } from 'react-grid-system';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

let id = 0;

const data = [
  createData('ABC Clinic', 'Enquiry about Opthalmology', '11.30 AM'),
  createData('DEF  Clinic', 'Enquiry about Rhinoplasty', '11.30 AM'),
  createData('XYZ Clinic', 'Enquiry about Opthalmology', '11.30 AM')
];

const data2 = [
  createData('GHI Clinic', 'Enquiry about Rhinoplasty', '1.30 PM'),
  createData('JFJK  Clinic', 'Enquiry about Rhinoplasty', '1.30 PM'),
  createData('LMN Clinic', 'Enquiry about Rhinoplasty', '1.30 PM')
];

function createData(name, enquiry, apptime) {
  id += 1;
  return { id, name, enquiry, apptime };
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class App extends Component {

    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };


    
    render() {

        const { value } = this.state;

        return (
            <div>
                <Header/>
                <Container fluid style={{ lineHeight: '32px' }}>
                  <Row>
                    <Col xs={6} md={6}>
                        <img src="./images/ad.png" alt="medipedia demo ad" className="home-ads-1" />
                    </Col>
                    <Col xs={6} md={3}>
                        <Paper elevation={4} className="subheader-block">
                            <Typography variant="headline" component="h3" className="subheader-title">
                              MEP Tokens
                            </Typography>
                            <Typography component="p" className="subheader-title ">
                              100
                            </Typography>
                        </Paper>
                    </Col>
                    <Col xs={6} md={3}>
                        <Paper elevation={4} className="subheader-block">
                            <Typography variant="headline" component="h3" className="subheader-title">
                              Reward Points
                            </Typography>
                            <Typography component="p" className="subheader-title ">
                              100
                            </Typography>
                        </Paper>
                    </Col>
                  </Row>
                  <Row >
                    <Col xs={6} md={2}>
                        <Button variant="contained" color="primary" className="menu-left">
                            Inbox
                        </Button>
                        <Button variant="outlined" className="menu-left">
                            Medical Request
                        </Button>
                        <Button variant="outlined" className="menu-left">
                            Interpreter
                        </Button>
                        <Button variant="outlined" className="menu-left">
                            Travel Agency
                        </Button>
                        <Button variant="outlined" className="menu-left">
                            Insurance
                        </Button>
                        <Button variant="outlined" className="menu-left">
                            Social Networking
                        </Button>
                    </Col>
                    <Col xs={6} md={10}>
                        {value === 0 && 
                            <TabContainer>
                                <Paper elevation={4} className="tabs-block">
                                    <Tabs
                                      value={this.state.value}
                                      indicatorColor="primary"
                                      textColor="primary"
                                      onChange={this.handleChange}
                                    >
                                      <Tab label="Enquiries"  value={0}>
                                        Item One
                                      </Tab>
                                      <Tab label="Promotions" value={1}>
                                        Item One
                                      </Tab>
                                    </Tabs>
                                    <Table className="enquiries-table">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Clinic</TableCell>
                                            <TableCell numeric>Enquiry Brief</TableCell>
                                            <TableCell numeric>Appointment Date/Time</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {data.map(n => {
                                            return (
                                              <TableRow key={n.id}>
                                                <TableCell component="th" scope="row">
                                                  {n.name}
                                                </TableCell>
                                                <TableCell numeric>{n.enquiry}</TableCell>
                                                <TableCell numeric>{n.apptime}</TableCell>
                                              </TableRow>
                                            );
                                          })}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </TabContainer>
                        }
                        {value === 1 && 
                            <TabContainer>
                                <Paper elevation={4} className="tabs-block">
                                    <Tabs
                                      value={this.state.value}
                                      indicatorColor="primary"
                                      textColor="primary"
                                      onChange={this.handleChange}
                                    >
                                      <Tab label="Enquiries"  value={0}>
                                        Item One
                                      </Tab>
                                      <Tab label="Promotions" value={1}>
                                        Item One
                                      </Tab>
                                    </Tabs>
                                    <Table className="enquiries-table">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Clinic</TableCell>
                                            <TableCell numeric>Enquiry Brief</TableCell>
                                            <TableCell numeric>Appointment Date/Time</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {data2.map(n => {
                                            return (
                                              <TableRow key={n.id}>
                                                <TableCell component="th" scope="row">
                                                  {n.name}
                                                </TableCell>
                                                <TableCell numeric>{n.enquiry}</TableCell>
                                                <TableCell numeric>{n.apptime}</TableCell>
                                              </TableRow>
                                            );
                                          })}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </TabContainer>
                        }
                    </Col>
                  </Row>
                </Container>
            </div>
        )
    }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
