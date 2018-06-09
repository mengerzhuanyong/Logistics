import GlobalStyles from "../../constant/GlobalStyle";

function() {
    return (
        <View>
            {this.state.style == '2' ?
                <View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity
                        style = {styles.paymentMethodItem}
                        onPress = {() => {
                            // this.getPrices();
                            let charteredCar = this.state.charteredCar == '1' ? 0 : 1;
                            this.updateState({
                                charteredCar: charteredCar,
                            })
                            this.getPrices(2, charteredCar);
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_car} style={styles.paymentMethodIcon} />
                            <Text style={styles.cargoAttributesTitle}>包车</Text>
                        </View>
                        <Image source={this.state.charteredCar == '1' ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                    {this.state.charteredCar == 0 &&
                    <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <TouchableOpacity
                            style = {styles.paymentMethodItem}
                            onPress = {() => this.makeCall()}
                        >
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_phone} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>立即咨询：{this.state.mobile}</Text>
                            </View>
                            <Image source={arrowRight} style={styles.arrowRightIcon} />
                        </TouchableOpacity>
                    </View>
                    }
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon} />
                            <TextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品名称"
                                // keyboardType = {'numeric'}
                                defaultValue = {this.state.cargoName}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                // onBlur = {() => this.getPrices(1, this.state.charteredCar)}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        cargoName: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_volume} style={styles.paymentMethodIcon} />
                            <CustomKeyboard.CustomTextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品体积"
                                customKeyboardType = "numberKeyBoardWithDot"
                                defaultValue = {this.state.volume}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                // onBlur = {() => this.getPrices(1, this.state.charteredCar)}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        volume: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.volumes}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    {this.state.charteredCar == 0 && <View>
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_count} style={styles.paymentMethodIcon} />
                                <CustomKeyboard.CustomTextInput
                                    style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder = "请输入物品数量"
                                    customKeyboardType = "numberKeyBoardWithDot"
                                    defaultValue = {this.state.count}
                                    placeholderTextColor = '#666'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            count: text
                                        })
                                    }}
                                />
                            </View>
                            <Text style={styles.cargoAttributesUnit}>{this.state.unit.num}</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                    </View>}
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_weight} style={styles.paymentMethodIcon} />
                            <CustomKeyboard.CustomTextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品重量"
                                customKeyboardType = "numberKeyBoardWithDot"
                                defaultValue = {this.state.weight}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        weight: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.weight}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <ModalDropdown
                        style = {[styles.paymentMethodItem, styles.selectView]}
                        textStyle = {styles.cargoAttributesTitle}
                        dropdownStyle = {styles.dropdownStyle}
                        defaultValue = { '请选择物品类型'}
                        renderRow={this.renderRow.bind(this)}
                        options = {category}
                        renderButtonText = {(rowData) => this.renderButtonText(rowData)}
                    >
                        <View style={styles.selectViewWrap}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo_type} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>{categoryText}</Text>
                            </View>
                            <Image source={arrowRight} style={styles.arrowRightIcon} />
                        </View>
                    </ModalDropdown>
                    {cate == '1' && <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon} />
                                <TextInput
                                    style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder = "请输入物品类型"
                                    // keyboardType = {'numeric'}
                                    defaultValue = {this.state.otherType}
                                    placeholderTextColor = '#666'
                                    underlineColorAndroid = {'transparent'}
                                    // onBlur = {() => this.getPrices(1, this.state.charteredCar)}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            otherType: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>}
                    {this.state.charteredCar == 0 &&
                    <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style = {styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_money} style={styles.paymentMethodIcon} />
                                <TextInput
                                    style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder = "输入咨询后的订单价格"
                                    keyboardType = {'numeric'}
                                    placeholderTextColor = '#666'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        let relprice = parseFloat(text).toFixed(2) - parseInt(this.state.coupon);
                                        // console.log(relprice);
                                        this.setState({
                                            price: text,
                                            relprice: relprice,
                                        })
                                    }}
                                />
                            </View>
                            <Text style={styles.cargoAttributesUnit}>元</Text>
                        </View>
                    </View>
                    }
                </View>
                :
                <View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity
                        style = {styles.paymentMethodItem}
                        onPress = {() => {
                            // this.getPrices();
                            let charteredCar = this.state.charteredCar == '1' ? 0 : 1;
                            this.updateState({
                                charteredCar: charteredCar,
                            })
                            this.getPrices(1, charteredCar);
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_car} style={styles.paymentMethodIcon} />
                            <Text style={styles.cargoAttributesTitle}>包车</Text>
                        </View>
                        <Image source={this.state.charteredCar == '1' ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon} />
                            <TextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品名称"
                                // keyboardType = {'numeric'}
                                defaultValue = {this.state.cargoName}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                // onBlur = {() => this.getPrices(1, this.state.charteredCar)}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        cargoName: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_volume} style={styles.paymentMethodIcon} />
                            <CustomKeyboard.CustomTextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品体积"
                                customKeyboardType = "numberKeyBoardWithDot"
                                defaultValue = {this.state.volume}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                onBlur = {() => this.getPrices(1, this.state.charteredCar)}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        volume: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.volumes}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_count} style={styles.paymentMethodIcon} />
                            <CustomKeyboard.CustomTextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品数量"
                                customKeyboardType = "numberKeyBoardWithDot"
                                defaultValue = {this.state.count}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        count: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.num}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_weight} style={styles.paymentMethodIcon} />
                            <CustomKeyboard.CustomTextInput
                                style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder = "请输入物品重量"
                                customKeyboardType = "numberKeyBoardWithDot"
                                defaultValue = {this.state.weight}
                                placeholderTextColor = '#666'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        weight: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.weight}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <ModalDropdown
                        style = {[styles.paymentMethodItem, styles.selectView]}
                        textStyle = {styles.cargoAttributesTitle}
                        dropdownStyle = {styles.dropdownStyle}
                        defaultValue = { '请选择物品类型'}
                        renderRow={this.renderRow.bind(this)}
                        options = {category}
                        renderButtonText = {(rowData) => this.renderButtonText(rowData)}
                    >
                        <View style={styles.selectViewWrap}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo_type} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>{categoryText}</Text>
                            </View>
                            <Image source={arrowRight} style={styles.arrowRightIcon} />
                        </View>
                    </ModalDropdown>
                    {cate == '1' && <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon} />
                                <TextInput
                                    style = {[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder = "请输入物品类型"
                                    // keyboardType = {'numeric'}
                                    defaultValue = {this.state.otherType}
                                    placeholderTextColor = '#666'
                                    underlineColorAndroid = {'transparent'}
                                    // onBlur = {() => this.getPrices(1, this.state.charteredCar)}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            otherType: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>}
                </View>
            }
        </View>
    );
}