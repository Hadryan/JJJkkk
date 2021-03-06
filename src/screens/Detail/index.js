
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { inject, observer } from 'mobx-react/native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import PhotoView from '@merryjs/photo-viewer';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

import classes from './classes';
import formatTime from 'utils/formatTime';
import Loader from 'ui/Loader';
import Footer from './Footer';
import FadeImage from 'ui/FadeImage';

@inject(stores => ({
    loading: stores.detail.loading,
    query: stores.detail.query,
    video: stores.detail.data,
    addFavorite: stores.me.addFavorite,
    removeFavorite: stores.me.removeFavorite,
}))
@observer
export default class Detail extends Component {
    componentWillMount() {
        var { params, query } = this.props;

        query(params.id);
    }

    state = {
        showFooter: false,
        index: 0,
        showPreview: false,
    };

    togglePreview(showPreview, index = 0) {
        this.setState({
            ...this.state,
            index,
            showPreview,
        });

        StatusBar.setHidden(true);
    }

    renderStars(stars) {
        var { navigator } = this.props;

        return stars.slice(0, 3).map((e, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={ev => {
                        navigator.showModal({
                            screen: 'zzyzx.ListByStar',
                            navigatorStyle: {
                                navBarHidden: true,
                            },
                            passProps: {
                                params: e
                            }
                        });
                    }}
                >
                    <FadeImage
                        {...{
                            showLoading: true,
                            resizeMode: 'cover',
                            source: {
                                uri: e.image,
                            },
                            style: classes.star,
                        }}
                    >
                        <LinearGradient
                            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
                            style={classes.starMask}
                        >
                            <Text style={classes.starName}>{e.name}</Text>
                        </LinearGradient>
                    </FadeImage>
                </TouchableOpacity>
            );
        });
    }

    renderTags(tags) {
        var { navigator } = this.props;

        return tags.map((e, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    style={classes.tag}
                    onPress={ev => {
                        navigator.showModal({
                            screen: 'zzyzx.ListByTag',
                            navigatorStyle: {
                                navBarHidden: true,
                            },
                            passProps: {
                                params: e
                            }
                        });
                    }}
                >
                    <Text style={classes.tagName}>{e.name}</Text>
                </TouchableOpacity>
            );
        });
    }

    renderPreviews(previews) {
        return previews.slice(0, 4).map((e, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={e => this.togglePreview(true, index)}
                >
                    <FadeImage
                        {...{
                            source: {
                                uri: e.small,
                            },
                            style: classes.preview,
                        }}
                    />
                </TouchableOpacity>
            );
        });
    }

    renderComments(comments) {
        return comments.map((e, index) => {
            return (
                <View
                    key={index}
                    style={classes.comment}
                >
                    <View>
                        <Text style={classes.content}>{e.content}</Text>
                    </View>

                    <View style={classes.commentMeta}>
                        <TouchableOpacity
                            style={classes.user}
                            onPress={ev => {
                                this.props.navigator.push({
                                    screen: 'zzyzx.User',
                                    navigatorStyle: {
                                        navBarHidden: true,
                                    },
                                    passProps: {
                                        params: {
                                            id: e.userid,
                                        }
                                    }
                                });
                            }}
                        >
                            <FadeImage
                                {...{
                                    source: {
                                        uri: e.avatar
                                    },
                                    resizeMode: 'cover',
                                    style: classes.avatar,
                                    containerStyle: {
                                        height: 32,
                                        width: 32,
                                        borderRadius: 32,
                                        overflow: 'hidden',
                                        marginRight: 10,
                                    },
                                }}
                            />
                            <Text style={classes.commentMetaText}>{e.nickname}</Text>
                        </TouchableOpacity>

                        <View style={classes.commentDate}>
                            <Text style={[
                                classes.commentMetaText,
                                { color: '#979797' }
                            ]}>
                                {moment(e.create_time).fromNow().toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        });
    }

    render() {
        var { id, cover, name, no, length, liked, date, rate, stars, trailler, previews, tags, comments } = this.props.video;

        return (
            <View style={classes.container}>
                <Loader show={this.props.loading} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    style={classes.mian}
                    onScroll={e => {
                        var { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
                        var showFooter = contentOffset.y > 100;

                        // Scroll to bottom hide footer
                        if (contentOffset.y + layoutMeasurement.height + 32 > contentSize.height) {
                            showFooter = false;
                        }

                        if (showFooter !== this.state.showHeader) {
                            // Toggle header, scroll down hide the header, scroll up show the header
                            this.setState({
                                showFooter,
                            });
                        }
                    }}
                >
                    <FadeImage
                        {...{
                            showLoading: true,
                            resizeMode: 'cover',
                            source: {
                                uri: cover,
                            },
                            style: classes.hero,
                        }}
                    >
                        <View style={classes.mask} />

                        <TouchableOpacity
                            style={classes.goback}
                            onPress={e => {
                                this.props.navigator.pop();
                            }}
                        >
                            <Icon name="ios-arrow-round-back" size={32} color="#fff" />
                        </TouchableOpacity>

                        <View style={classes.rate}>
                            <Text style={classes.rateText}>{(+(rate || 0)).toFixed(1)}</Text>
                        </View>
                    </FadeImage>

                    <View style={classes.header}>
                        <Text style={classes.title}>{name}</Text>

                        <View style={classes.line} />

                        <Text style={classes.meta}>
                            {no} | {new Date(date).getFullYear()} | {formatTime(length)}
                        </Text>
                    </View>

                    <View style={classes.body}>
                        <View style={classes.videoAndPhoto}>
                            {
                                trailler && (
                                    <FadeImage
                                        {...{
                                            resizeMode: 'cover',
                                            source: {
                                                uri: trailler.cover || cover,
                                            },
                                            style: classes.traillerCover,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={classes.playTrailler}
                                            onPress={e => this.props.navigator.push({
                                                screen: 'zzyzx.VideoPlayer',
                                                navigatorStyle: {
                                                    navBarHidden: true,
                                                },
                                                passProps: {
                                                    params: {
                                                        uri: trailler.src,
                                                    }
                                                },
                                            })}
                                        >
                                            <Icon name="ios-play" size={14} color="#000" />
                                        </TouchableOpacity>
                                    </FadeImage>
                                )
                            }

                            {
                                previews.length > 0 && (
                                    <View>
                                        <View style={classes.previews}>
                                            {
                                                this.renderPreviews(previews)
                                            }
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={e => this.togglePreview(true, 0)}
                                        >
                                            <View style={classes.viewMore}>
                                                <Text style={classes.viewMoreText}>
                                                    VIEW ALL {previews.length > 9 ? '9+' : previews.length} PHOTOS
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>

                        {
                            stars && (
                                <View style={classes.stars}>
                                    {
                                        this.renderStars(stars)
                                    }
                                </View>
                            )
                        }

                        <View style={classes.tags}>
                            {
                                this.renderTags(tags)
                            }
                        </View>

                        <View style={classes.comments}>
                            {
                                this.renderComments(comments)
                            }
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={e => {
                                    console.log('why??', id);
                                    this.props.navigator.showModal({
                                        screen: 'zzyzx.Comments',
                                        navigatorStyle: {
                                            navBarHidden: true,
                                        },
                                        passProps: {
                                            params: {
                                                id,
                                            },
                                        }
                                    });
                                }}
                            >
                                <View style={classes.viewMore}>
                                    <Text style={classes.viewMoreText}>
                                        VIEW ALL COMMENTS
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <Footer
                    {...{
                        show: this.state.showFooter,
                        liked,
                        favorite: async() => {
                            if (liked) {
                                if (
                                    await this.props.removeFavorite(id)
                                ) {
                                    this.props.video.liked = false;
                                }
                                return;
                            }

                            if (
                                await this.props.addFavorite({
                                    jav: id,
                                    title: name,
                                    cover,
                                    no,
                                })
                            ) {
                                this.props.video.liked = true;
                            }
                        },
                        play: () => {
                            if (!trailler) {
                                this.props.showError('Not available.');
                                return;
                            }

                            this.props.navigator.push({
                                screen: 'zzyzx.VideoPlayer',
                                navigatorStyle: {
                                    navBarHidden: true,
                                },
                                passProps: {
                                    params: {
                                        no
                                    }
                                },
                            });
                        },
                    }}
                />

                <PhotoView
                    hideCloseButton={true}
                    hideShareButton={true}
                    visible={this.state.showPreview}
                    data={previews.map(e => ({ source: { uri: e.large } }))}
                    hideStatusBar={true}
                    initial={this.state.index}
                    onDismiss={e => {
                        this.togglePreview(false);
                    }}
                />
            </View>
        );
    }
}
