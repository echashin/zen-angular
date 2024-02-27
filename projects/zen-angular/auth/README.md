## Auth
For using auth module component import module with required params:
```typescript
    ZenAuthModule.forRoot({
      authPageUrl: 'auth',
      homePageUrl: 'dashboard',
      urls: {
        apiDomain: 'localhost:3333',
        signInUrl: '/auth-manager/sign-in',
        phoneSignInUrl: '/auth-manager/phone-sign-in',
        refreshUrl: '/auth-manager/refresh',
      },
    })
```

If your api using additional params for signIn, singOut or refresh endpoints use:
* signInAdditional
* refreshAdditional

As example: 
```typescript
LbAuthModule.forRoot({
  ...defParams,
  signInAdditional: {
    factory: (push: PushNotificationService, device: DeviceService) => {
      const deviceInfo: Record<string, string> = device.getDeviceInfo();
      const res: Record<string, any> = {
        deviceId: deviceInfo.deviceId,
        deviceType: deviceInfo.deviceType,
        deviceName: deviceInfo.deviceName,
        deviceBrand: deviceInfo.deviceBrand,
        deviceOs: deviceInfo.deviceOs,
        ...(push.token && { pushNotificationToken: push.token }),
      };

      if (!push.token) {
        push.token$.subscribe((token: string) => {
          res.pushNotificationToken = token;
        });
      }

      return res;
    },
    inject: [PushNotificationService, DeviceService],
  },
  refreshAdditional: {
    factory: (deviceService: DeviceService) => {
      const deviceInfo: Record<string, string> = deviceService.getDeviceInfo();
      return { deviceId: deviceInfo.deviceId };
    },
    inject: [DeviceService],
  },
})
```

## ACL
1. Iter your resources to ACCESS_TOKEN
   * if it's default do it from ```providers``` in module
    ```typescript
    {
      provide: ACCESS_TOKEN,
      useValue: TestAclObject,
    }
    ```
   * or use ```@Inject(ACCESS_TOKEN)```

2. also use ```RoleService``` for set or update user role
3. add guard with ```resource,action``` parameters
    ```typescript
    { ///route
      path: 'delivery-zones',
      loadChildren: () => import('./pages/delivery-zones/delivery-zones.module'),
      canActivate: [AclPagesGuard('DELIVERY_ZONES', 'FIND')],
    }
    ```
4. For dynamic update guard use ```GuardControlService```
