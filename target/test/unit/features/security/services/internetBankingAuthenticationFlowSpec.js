describe('Unit Test - InternetBankingAuthenticationFlow', function () {
    beforeEach(module('refresh.internetBankingAuthenticationFlow'));

    describe('Given it has been instantiated', function () {
        var InternetBankingAuthenticationFlow,
            AuthenticationService,
            ApplicationParameters,
            $location,
            username = 'Jack',
            password = 'TheGiantSlayer';

        var expectedErrorObj = {
            message: 'an error has occurred'
        };

        beforeEach(function () {
            var authenticationService = jasmine.createSpyObj('AuthenticationService', ['login']),
                user = jasmine.createSpyObj('User', ['build']),
                applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable']);

            module(function ($provide) {
                $provide.value('AuthenticationService', authenticationService);
                $provide.value('User', user);
                $provide.value('ApplicationParameters', applicationParameters);
            });
        });

        beforeEach(inject(function (_AuthenticationService_, _InternetBankingAuthenticationFlow_, $q, _$location_, _ApplicationParameters_) {
            ApplicationParameters = _ApplicationParameters_;
            AuthenticationService = _AuthenticationService_;
            InternetBankingAuthenticationFlow = _InternetBankingAuthenticationFlow_;
            $location = _$location_;
        }));


        it(', it should be named \'LithiumAuthenticationFlow\'', function () {
            expect(InternetBankingAuthenticationFlow.getName()).toBe('InternetBankingAuthenticationFlow');
        });

        describe('When InternetBankingAuthenticationFlow.start(' + username + ', ' + password + ')', function () {

            beforeEach(inject(function ($q) {
                AuthenticationService.login.and.returnValue($q.reject(expectedErrorObj));
                InternetBankingAuthenticationFlow.start(username, password);
            }));

            describe('Given standard bank authentication is unsuccessful', function () {
                it(', it should propagate the error object to the consumer', inject(function ($rootScope) {
                    var _actualErrorObject;

                    InternetBankingAuthenticationFlow.failure(function (actualErrorObject) {
                        _actualErrorObject = actualErrorObject;
                    });
                    $rootScope.$digest();
                    expect(_actualErrorObject).toBe(expectedErrorObj);
                }));
            });
        });

        describe('When InternetBankingAuthenticationFlow.start(' + username + ', ' + password + ')', function () {
            var data, $rootScope, User, $q;

            beforeEach(inject(function (_$q_, _$rootScope_, _User_) {
                User = _User_;
                $q = _$q_;
                User.build.and.returnValue($q.when());
                $rootScope = _$rootScope_;
                data = {userProfile: 'monkey'};
                AuthenticationService.login.and.returnValue($q.when(data));
                InternetBankingAuthenticationFlow.start(username, password);
            }));

            it(',it should call the AuthenticationService.login(' + username + ', ' + password + ') ', function () {
                expect(AuthenticationService.login).toHaveBeenCalledWith(username, password);
            });

            describe('when standard bank authentication is successful', function () {
                it(', it should call user.build() with a profile', inject(function(){
                    $rootScope.$digest();
                    expect(User.build).toHaveBeenCalledWith(data.userProfile);
                }));

                it(', it should set the ApplicationParameter \'canDelay\' to true', function(){
                    $rootScope.$digest();
                    expect(ApplicationParameters.pushVariable).toHaveBeenCalledWith('canDelay', true);
                });

                it(', it should set the ApplicationParameter \'hasInfo\' to true', function(){
                    $rootScope.$digest();
                    expect(ApplicationParameters.pushVariable).toHaveBeenCalledWith('hasInfo', true);
                });

                describe('When user build is successful', function () {
                    it(', it should navigate to switchDashboard', function () {
                        $rootScope.$digest();
                        expect($location.path()).toBe('/switchDashboard');
                    });
                });

                describe('when user.build() is unsuccessful', function () {
                    it(', it should propagate the error object to the user', function(){
                        var _actualErrorObject;

                        User.build.and.returnValue($q.reject(expectedErrorObj));

                        InternetBankingAuthenticationFlow.failure(function (actualErrorObject) {
                            _actualErrorObject = actualErrorObject;
                        });

                        $rootScope.$digest();

                        expect(_actualErrorObject).toEqual(expectedErrorObj);
                    });
                });
            });
        });
    });
});