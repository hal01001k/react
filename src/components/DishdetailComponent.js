import React, {Component} from "react";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody,
    Col, Label, Row
} from 'reactstrap';
import {baseUrl} from '../shared/baseUrl';
import {Link} from 'react-router-dom';
import {Loading} from './LoadingComponent';
import {Control, LocalForm, Errors} from "react-redux-form";

function RenderDish({dish}) {
    if (dish != null)
        return (
            <div className="col-12 col-md-5 m-1">
                <Card>
                    <CardImg top src={baseUrl + dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    else
        return (
            <div></div>
        );
}

function RenderComments({comments, postComment, dishId}) {
    if (comments != null)
        return (
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    {comments.map((comment) => {
                        return (
                            <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit'
                                }).format(new Date(Date.parse(comment.date)))}</p>
                            </li>
                        );
                    })}
                </ul>
                <CommentForm dishId={dishId} postComment={postComment}/>
            </div>
        );
    else
        return (
            <div></div>
        );
}

const DishDetail = (props) => {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading/>
                </div>
            </div>
        );
    } else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    } else if (props.dish != null)
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish}/>
                    <RenderComments comments={props.comments}
                                    postComment={props.postComment}
                                    dishId={props.dish.id}/>
                </div>
            </div>
        );
    else
        return (
            <div>
            </div>
        );
}


export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

export class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isNavOpen: false,
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }


    render() {
        return (
            <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment
                </Button>
                <div className="row">
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <div>
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                    <Row className="form-group">
                                        <Col md={12}>
                                            <Label className="form-group" htmlFor="rating">Rating</Label></Col>
                                        <Col md={12}>
                                            <Control.select model=".rating" name="rating" className="form-control ">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Col md={12}>
                                            <Label className="form-group" htmlFor="author">Your name</Label></Col>
                                        <Col md={12}>
                                            <Control.text model=".author" id="author" name="author" placeholder="Author"
                                                          className="form-control" validators={{
                                                required,
                                                minLength: minLength(3),
                                                maxLength: maxLength(15)
                                            }}/>
                                            <Errors className="text-danger" model=".author" show="touched" messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 3 characters',
                                                maxLength: 'Must be 15 charaters or less'
                                            }}/>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Col md={12}>
                                            <Label className="form-group" htmlFor="feedback">Your feedback</Label></Col>
                                        <Col md={12}>
                                            <Control.textarea model=".comment" id="comment" name="comment" rows="6"
                                                              className="form-control" validators={{required}}/>
                                            <Errors className="text-danger" model=".comment" show="touched"
                                                    messages={{required: 'Required'}}/>
                                        </Col>
                                    </Row>
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                                </LocalForm>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}
