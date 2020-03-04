import {Component, Vue} from "vue-property-decorator";
import {UserInfo, UserRole, UserRoleWithGuest} from "~/types";
import {User} from "~/assets/js/api/user";

@Component
export default class UserMixins extends Vue {
  protected get user(): UserInfo | undefined {
    if (this.$auth.loggedIn) {
      return (this.$auth.user) as UserInfo
    }
    return undefined
  }

  protected get role(): UserRoleWithGuest {
    return this.user ? this.user.role : 'guest'
  }

  protected get isAdmin(): boolean {
    return this.role === User.ADMIN
  }

  protected get isUser(): boolean {
    return this.role === User.USER
  }

  protected get isSuperAdmin(): boolean {
    return this.role === User.SUPER_ADMIN
  }

  protected get isGuest(): boolean {
    return this.role === User.GUEST
  }

  protected userRoleFormatted(userRole: UserRole): string {
    switch (userRole) {
      case User.USER:
        return 'Utilisateur';
      case User.ADMIN:
        return 'Administrateur';
      case User.SUPER_ADMIN:
        return 'Super Administrateur';
    }
    return '-'
  }
}
