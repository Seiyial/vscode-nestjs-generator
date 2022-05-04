export const writeTemplateControllerFile = (
	fileName: string,
	resourceNameKebab: string,
	resourceNamePascal: string,
	controllerPath: string,
	extraImportsFromNestCommon: string[] = [],
	customImports: string = "import { PrismaService } from 'setup/db/prisma.service'\nimport { AuthGuard } from 'modules/auth/auth.guard'\nimport { AppSession } from 'modules/auth/auth.types'",
	customConstructorParams: string = "private readonly prisma: PrismaService",
) => `import { ${ ['Controller', 'Get', 'Post', 'UseGuards', 'Session', 'Logger', ...extraImportsFromNestCommon].join(', ') } } from '@nestjs/common'
${ customImports ? customImports + '\n' : '' }import { ${ resourceNamePascal }Service } from './${ resourceNameKebab}.service'

@Controller('${controllerPath}')
export class ${ resourceNamePascal }Controller {

	logger = new Logger('${ fileName }')

	constructor(
		private readonly svc: ${resourceNamePascal}Service,
		${ customConstructorParams ?? '' }
	) {}

	@UseGuards(AuthGuard)
	@Get('')
	public doesNothing (
		@Session() session: AppSession
	) {

	}

}
`;